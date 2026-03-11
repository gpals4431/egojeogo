# ⚡ Quick Start Guide

## 🚀 5분 안에 MSA 실행하기

### 1️⃣ 사전 준비
```bash
# Java 21 설치 확인
java -version

# 프로젝트 클론
cd D:\알고리즘\egojeogo
```

### 2️⃣ 빌드
```bash
# 전체 빌드 (최초 1회)
./gradlew build
```

### 3️⃣ 실행

#### 방법 A: Gradle로 실행 (개발 추천)

**터미널 1:**
```bash
./gradlew :subway-service:bootRun
```

**터미널 2:**
```bash
./gradlew :weather-service:bootRun
```

**터미널 3:**
```bash
./gradlew :api-gateway:bootRun
```

**터미널 4:**
```bash
cd frontend
npm run dev
```

#### 방법 B: Docker Compose로 실행 (운영 환경)

```bash
docker-compose up
```

### 4️⃣ 확인

**브라우저:**
- Frontend: http://localhost:5173
- API Gateway: http://localhost:8080/actuator/health

**터미널:**
```bash
# 지하철 정보
curl http://localhost:8080/api/subway/favorites

# 날씨 정보
curl "http://localhost:8080/api/weather?region=서울"
```

---

## 🎯 주요 엔드포인트

| 서비스 | URL | 포트 |
|--------|-----|------|
| Frontend | http://localhost:5173 | 5173 |
| API Gateway | http://localhost:8080 | 8080 |
| Subway Service | http://localhost:8081 | 8081 |
| Weather Service | http://localhost:8082 | 8082 |

---

## 🛑 종료

**Gradle:**
```bash
# Ctrl+C로 각 터미널 종료
```

**Docker:**
```bash
docker-compose down
```

---

## 📚 더 알아보기

- [MSA-README.md](./MSA-README.md) - 전체 문서
- [MIGRATION-GUIDE.md](./MIGRATION-GUIDE.md) - 마이그레이션 가이드

**Happy Coding! 🚀**
