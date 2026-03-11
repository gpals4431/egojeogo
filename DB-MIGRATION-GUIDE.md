# 🔄 데이터베이스 마이그레이션 가이드

## 📋 목표

```
Before (모놀리식):
backend/data/testdb.mv.db
├── FAVORITE_STATION (지하철)
└── REGION (날씨)

After (MSA):
subway-service/data/subway-db.mv.db
└── FAVORITE_STATION

weather-service/data/weather-db.mv.db
└── REGION
```

---

## 🚀 마이그레이션 단계

### Step 1: 기존 데이터 확인

```bash
# Backend 서버 실행 (아직 실행 중이면 건너뛰기)
cd backend
./gradlew bootRun
```

**H2 Console 접속:**
```
URL: http://localhost:8030/api/h2-console
JDBC URL: jdbc:h2:file:./data/testdb
Username: sa
Password: sa
```

**데이터 Export:**
```sql
-- 지하철 데이터 확인
SELECT * FROM FAVORITE_STATION;

-- 날씨 지역 데이터 확인
SELECT * FROM REGION;
```

결과를 복사해두세요!

---

### Step 2: Subway Service DB 생성 및 데이터 이동

**2-1. Subway Service 실행 (새 터미널)**
```bash
cd D:\알고리즘\egojeogo
./gradlew :subway-service:bootRun
```

서버 시작 확인:
```
🚇 Subway Service started on port 8081
```

**2-2. H2 Console 접속**
```
URL: http://localhost:8081/h2-console
JDBC URL: jdbc:h2:file:./data/subway-db
Username: sa
Password: sa
```

**2-3. 테이블 확인**
```sql
-- JPA가 자동 생성한 테이블 확인
SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'PUBLIC';

-- FAVORITE_STATION 테이블이 있어야 함
SELECT * FROM FAVORITE_STATION;
-- (아직 데이터 없음)
```

**2-4. 데이터 Insert**

Step 1에서 복사한 FAVORITE_STATION 데이터를 INSERT:

```sql
-- 예시 (실제 데이터로 교체)
INSERT INTO FAVORITE_STATION (user_id, station_name, up_down_line, line, created_at, updated_at)
VALUES 
    ('DFDF', '신림', '상행', '2호선', CURRENT_TIMESTAMP, NULL),
    ('me', '외대앞', '하행', '1호선', CURRENT_TIMESTAMP, NULL);

-- 확인
SELECT * FROM FAVORITE_STATION;
```

---

### Step 3: Weather Service DB 생성 및 데이터 이동

**3-1. Weather Service 실행 (새 터미널)**
```bash
cd D:\알고리즘\egojeogo
./gradlew :weather-service:bootRun
```

서버 시작 확인:
```
🌤️ Weather Service started on port 8082
```

**3-2. H2 Console 접속**
```
URL: http://localhost:8082/h2-console
JDBC URL: jdbc:h2:file:./data/weather-db
Username: sa
Password: sa
```

**3-3. 데이터 Insert**

Step 1에서 복사한 REGION 데이터를 INSERT:

```sql
-- 예시 (실제 데이터로 교체)
INSERT INTO REGION (region_code, region_name, region_parent, region_child, nx, ny, latitude, longitude)
VALUES 
    ('1111051000', '서울특별시 종로구 청운동', '서울특별시', '종로구', 60, 127, 37.58, 126.97),
    ('1111053000', '서울특별시 종로구 신교동', '서울특별시', '종로구', 60, 127, 37.58, 126.97);
    -- ... 더 많은 데이터

-- 확인
SELECT * FROM REGION;
```

---

### Step 4: API Gateway 실행 (새 터미널)

```bash
cd D:\알고리즘\egojeogo
./gradlew :api-gateway:bootRun
```

서버 시작 확인:
```
🚪 API Gateway started on port 8080
```

---

### Step 5: 통합 테스트

**모든 서비스 실행 확인:**
```
✅ Subway Service: http://localhost:8081
✅ Weather Service: http://localhost:8082
✅ API Gateway: http://localhost:8080
```

**API 테스트:**

```bash
# 지하철 정보 (Gateway 경유)
curl http://localhost:8080/api/subway/favorites

# 날씨 정보 (Gateway 경유)
curl "http://localhost:8080/api/weather?region=서울"

# 직접 호출
curl http://localhost:8081/favorites
curl "http://localhost:8082/weather?region=서울"
```

---

## 🎯 자동 마이그레이션 (선택사항)

수동 작업이 번거로우면 SQL 스크립트로 자동화할 수 있습니다:

### 1. Backend에서 데이터 Export

**backend H2 Console에서:**
```sql
-- 파일로 저장
SCRIPT TO 'D:/알고리즘/egojeogo/backup.sql';
```

### 2. 필터링해서 각 서비스로 Import

파일을 열어서:
- FAVORITE_STATION 관련 INSERT → subway-service에 실행
- REGION 관련 INSERT → weather-service에 실행

---

## ✅ 마이그레이션 완료 확인

### 체크리스트

- [ ] Subway Service DB에 FAVORITE_STATION 데이터 있음
- [ ] Weather Service DB에 REGION 데이터 있음
- [ ] API Gateway를 통한 호출 정상 동작
- [ ] Frontend 연동 정상
- [ ] 각 서비스 독립 실행 가능

### DB 파일 확인

```bash
# 파일 존재 확인
ls subway-service/data/subway-db.mv.db
ls weather-service/data/weather-db.mv.db

# 파일 크기 확인 (데이터가 있으면 크기 증가)
Get-ChildItem subway-service/data/subway-db.mv.db
Get-ChildItem weather-service/data/weather-db.mv.db
```

---

## 🔙 문제 발생 시

### 테이블이 생성 안 됨
→ 각 서비스가 정상 실행되었는지 확인 (JPA가 자동 생성)

### 데이터 Insert 실패
→ 컬럼명, 데이터 타입 확인

### 연결 안 됨
→ JDBC URL 확인 (`./data/subway-db` vs `./data/weather-db`)

---

## 🎉 완료!

이제 완전한 MSA 구조가 되었습니다:
- ✅ 독립 실행
- ✅ 독립 DB
- ✅ 네트워크 통신
- ✅ 독립 배포 가능

**Happy Coding! 🚀**
