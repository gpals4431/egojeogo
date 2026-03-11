# 🚀 MSA 서비스 실행 및 DB 분리 가이드

## 📋 현재 상황
- Backend 실행 중 (Port 8030)
- 단일 DB: backend/data/testdb.mv.db
- 목표: subway-service와 weather-service로 분리

---

## ✅ 실행 순서

### 1단계: Backend 데이터 확인 및 Export

**터미널에서 Backend가 실행 중인지 확인:**
```
http://localhost:8030/api
```

**H2 Console 접속:**
```
URL: http://localhost:8030/api/h2-console
JDBC URL: jdbc:h2:file:./data/testdb
Username: sa
Password: sa
```

**데이터 확인 및 Export:**
```sql
-- 1. 지하철 데이터 확인
SELECT * FROM FAVORITE_STATION;

-- 결과를 복사해두세요!

-- 2. 지역 데이터 확인
SELECT * FROM REGION;

-- 결과를 복사해두세요!

-- 3. 전체 백업 (선택)
SCRIPT TO 'D:/알고리즘/egojeogo/backup-full.sql';
```

---

### 2단계: Subway Service 실행 (새 터미널)

```bash
# 새 PowerShell 터미널 열기
cd D:\알고리즘\egojeogo
./gradlew :subway-service:bootRun
```

**확인:**
```
✅ 🚇 Subway Service started on port 8081
✅ Hibernate: create table favorite_station ...
✅ 파일 생성: subway-service/data/subway-db.mv.db
```

**H2 Console 접속:**
```
URL: http://localhost:8081/h2-console
JDBC URL: jdbc:h2:file:./data/subway-db
Username: sa
Password: sa
```

**데이터 Insert:**
```sql
-- 1단계에서 복사한 FAVORITE_STATION 데이터 Insert
-- 예시:
INSERT INTO FAVORITE_STATION (user_id, station_name, up_down_line, line, created_at)
VALUES 
    ('DFDF', '신림', '상행', '2호선', CURRENT_TIMESTAMP),
    ('me', '외대앞', '하행', '1호선', CURRENT_TIMESTAMP);

-- 확인
SELECT * FROM FAVORITE_STATION;
```

---

### 3단계: Weather Service 실행 (또 다른 새 터미널)

```bash
# 새 PowerShell 터미널 열기
cd D:\알고리즘\egojeogo
./gradlew :weather-service:bootRun
```

**확인:**
```
✅ 🌤️ Weather Service started on port 8082
✅ Hibernate: create table region ...
✅ 파일 생성: weather-service/data/weather-db.mv.db
```

**H2 Console 접속:**
```
URL: http://localhost:8082/h2-console
JDBC URL: jdbc:h2:file:./data/weather-db
Username: sa
Password: sa
```

**데이터 Insert:**
```sql
-- 1단계에서 복사한 REGION 데이터 Insert
-- REGION 테이블이 많을 수 있으므로, 전체 백업 파일에서 REGION 관련 INSERT만 복사

-- 확인
SELECT * FROM REGION;
SELECT COUNT(*) FROM REGION;
```

---

### 4단계: API Gateway 실행 (또 다른 새 터미널)

```bash
# 새 PowerShell 터미널 열기
cd D:\알고리즘\egojeogo
./gradlew :api-gateway:bootRun
```

**확인:**
```
✅ 🚪 API Gateway started on port 8080
✅ Routes configured
```

---

### 5단계: 테스트

**API 테스트:**
```bash
# Subway (Gateway 경유)
curl http://localhost:8080/api/subway/favorites

# Weather (Gateway 경유)
curl "http://localhost:8080/api/weather?region=서울"

# Subway (직접)
curl http://localhost:8081/favorites

# Weather (직접)
curl "http://localhost:8082/weather?region=서울"
```

**H2 Console 확인:**
```
Subway DB:   http://localhost:8081/h2-console
Weather DB:  http://localhost:8082/h2-console
Gateway:     (DB 없음)
```

---

### 6단계: DB 분리 확인

**파일 확인:**
```powershell
# 각 서비스별 DB 파일 확인
dir subway-service\data\subway-db.mv.db
dir weather-service\data\weather-db.mv.db

# 크기 확인 (데이터 있으면 크기 증가)
Get-Item subway-service\data\subway-db.mv.db | Select-Object Name, Length
Get-Item weather-service\data\weather-db.mv.db | Select-Object Name, Length
```

---

## 🎯 최종 상태

### 실행 중인 서비스 (4개)
```
✅ Backend (8030) - 원래 것, 이후 종료 가능
✅ Subway Service (8081) - 독립 DB
✅ Weather Service (8082) - 독립 DB
✅ API Gateway (8080) - 진입점
```

### DB 파일
```
backend/data/testdb.mv.db           (원본, 백업용)
subway-service/data/subway-db.mv.db (FAVORITE_STATION)
weather-service/data/weather-db.mv.db (REGION)
```

---

## 🎉 완료!

이제 진짜 MSA입니다:
- ✅ 3개 독립 프로세스
- ✅ 3개 독립 DB
- ✅ HTTP 네트워크 통신
- ✅ 독립 배포 가능

Backend는 이제 종료해도 됩니다 (Ctrl+C)

---

## ⚠️ 문제 발생 시

### "Address already in use" 에러
```powershell
# 포트 확인
netstat -ano | findstr "8081"
netstat -ano | findstr "8082"

# 프로세스 종료
taskkill /PID [PID번호] /F
```

### DB 연결 안 됨
- JDBC URL 확인: `jdbc:h2:file:./data/subway-db` (상대경로)
- 또는 절대경로: `jdbc:h2:file:D:/알고리즘/egojeogo/subway-service/data/subway-db`

### 테이블 없음
- 서비스가 정상 실행되었는지 확인 (JPA가 자동 생성)
- 로그에서 "Hibernate: create table ..." 확인
