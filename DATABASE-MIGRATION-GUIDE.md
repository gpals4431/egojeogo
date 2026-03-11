# 📊 데이터베이스 마이그레이션 가이드

Backend (8030)의 단일 DB → MSA 각 서비스별 독립 DB로 데이터 이전

---

## 📦 마이그레이션 대상

### 1. Weather Service (8082)
- **테이블**: `REGION`
- **대상 DB**: `./data/weather-db`
- **컬럼**: 
  - `region_code` (PK)
  - `region_parent` (시도명)
  - `region_child` (시군구)
  - `region_name` (지역명)
  - `nx` (x좌표)
  - `ny` (y좌표)
  - `latitude` (위도)
  - `longitude` (경도)

### 2. Subway Service (8081)
- **테이블**: `FAVORITE_STATION`
- **대상 DB**: `./data/subway-db`
- **컬럼**:
  - `id` (PK, Auto Increment)
  - `user_id`
  - `station_name`
  - `up_down_line`
  - `line`
  - `created_at`
  - `updated_at`

---

## 🔄 마이그레이션 방법

### **방법 1: H2 Console에서 수동 마이그레이션 (빠름)**

#### Step 1: 기존 DB에서 데이터 추출

1. **Backend (8030) H2 Console 접속**
   ```
   URL: http://localhost:8030/api/h2-console
   JDBC URL: jdbc:h2:file:./data/testdb
   Username: sa
   Password: sa
   ```

2. **REGION 테이블 데이터 확인**
   ```sql
   SELECT * FROM REGION;
   ```

3. **INSERT 문 생성 (Weather용)**
   ```sql
   SELECT 'INSERT INTO REGION (region_code, region_parent, region_child, region_name, nx, ny, latitude, longitude) VALUES (' || 
          region_code || ', ''' || region_parent || ''', ''' || 
          region_child || ''', ''' || region_name || ''', ' || 
          nx || ', ' || ny || ', ' || latitude || ', ' || longitude || ');'
   FROM REGION;
   ```

4. **FAVORITE_STATION 테이블 데이터 확인**
   ```sql
   SELECT * FROM FAVORITE_STATION;
   ```

5. **INSERT 문 생성 (Subway용)**
   ```sql
   SELECT 'INSERT INTO FAVORITE_STATION (id, user_id, station_name, up_down_line, line, created_at, updated_at) VALUES (' || 
          id || ', ''' || user_id || ''', ''' || station_name || ''', ''' || 
          up_down_line || ''', ''' || line || ''', ''' || 
          created_at || ''', ''' || updated_at || ''');'
   FROM FAVORITE_STATION;
   ```

#### Step 2: 새 DB에 데이터 삽입

**Weather Service (8082) H2 Console**
```
URL: http://localhost:8082/h2-console
JDBC URL: jdbc:h2:file:./data/weather-db
```

**Subway Service (8081) H2 Console**
```
URL: http://localhost:8081/h2-console
JDBC URL: jdbc:h2:file:./data/subway-db
```

생성된 INSERT 문을 각각 실행

---

### **방법 2: data.sql 파일 사용 (자동화)**

#### Step 1: INSERT 문을 data.sql에 추가

1. **Weather Service**
   - 파일: `weather-service/src/main/resources/data.sql`
   - Backend H2 Console에서 생성한 REGION INSERT 문을 복사하여 붙여넣기

2. **Subway Service**
   - 파일: `subway-service/src/main/resources/data.sql`
   - Backend H2 Console에서 생성한 FAVORITE_STATION INSERT 문을 복사하여 붙여넣기

#### Step 2: 서비스 재시작

```bash
# 기존 서비스 중지 (Ctrl+C)

# Weather Service 재시작
.\gradlew.bat :weather-service:bootRun

# Subway Service 재시작  
.\gradlew.bat :subway-service:bootRun
```

**자동으로 data.sql이 실행되어 데이터가 삽입됩니다!**

---

## ⚙️ 설정 확인

### Weather Service - `application.yml`
```yaml
spring:
  datasource:
    url: jdbc:h2:file:./data/weather-db
  sql:
    init:
      mode: always  # data.sql 자동 실행
      encoding: UTF-8
```

### Subway Service - `application.yml`
```yaml
spring:
  datasource:
    url: jdbc:h2:file:./data/subway-db
  sql:
    init:
      mode: always  # data.sql 자동 실행
      encoding: UTF-8
```

---

## 🧪 검증

### 1. Weather Service DB 확인
```
http://localhost:8082/h2-console
JDBC URL: jdbc:h2:file:./data/weather-db

SELECT COUNT(*) FROM REGION;
```

### 2. Subway Service DB 확인
```
http://localhost:8081/h2-console
JDBC URL: jdbc:h2:file:./data/subway-db

SELECT COUNT(*) FROM FAVORITE_STATION;
```

---

## 📝 주의사항

1. **data.sql은 첫 실행 시에만 필요**
   - 데이터 마이그레이션 완료 후 `sql.init.mode: never`로 변경 권장
   - 또는 data.sql 파일 삭제

2. **Backend (8030)는 백업용으로 유지**
   - 마이그레이션 검증 완료 전까지 삭제하지 말 것
   - 롤백이 필요할 수 있음

3. **DB 파일 위치**
   ```
   D:\알고리즘\egojeogo\data\
   ├── testdb.mv.db       (Backend - 기존)
   ├── subway-db.mv.db    (Subway Service)
   └── weather-db.mv.db   (Weather Service)
   ```

---

## 🎯 전체 플로우

```
1. Backend (8030) 실행 ✅
   └─ testdb에 기존 데이터 확인

2. H2 Console에서 INSERT 문 생성
   ├─ REGION → weather-service/data.sql
   └─ FAVORITE_STATION → subway-service/data.sql

3. Subway/Weather Service 실행 ✅
   └─ data.sql 자동 실행 → 데이터 삽입

4. H2 Console에서 검증
   ├─ Weather DB: REGION 테이블 확인
   └─ Subway DB: FAVORITE_STATION 테이블 확인

5. Frontend → API Gateway → 각 Service 테스트 ✅
```

---

## 🚀 빠른 시작

```bash
# 1. Backend 실행 (데이터 확인용)
.\gradlew.bat :backend:bootRun

# 2. H2 Console에서 INSERT 문 생성 및 복사
# http://localhost:8030/api/h2-console

# 3. data.sql에 붙여넣기
# - weather-service/src/main/resources/data.sql
# - subway-service/src/main/resources/data.sql

# 4. 새 서비스 실행
.\gradlew.bat :subway-service:bootRun
.\gradlew.bat :weather-service:bootRun

# 5. API Gateway 실행
.\gradlew.bat :api-gateway:bootRun

# 6. Frontend 재시작
cd frontend
npm run dev
```

**마이그레이션 완료!** 🎉
