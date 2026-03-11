# 🚀 Egojeogo MSA 프로젝트

## 📋 목차
- [프로젝트 개요](#프로젝트-개요)
- [아키텍처](#아키텍처)
- [프로젝트 구조](#프로젝트-구조)
- [시작하기](#시작하기)
- [API 문서](#api-문서)
- [배포](#배포)
- [마이그레이션 가이드](#마이그레이션-가이드)

---

## 🎯 프로젝트 개요

**Egojeogo**는 지하철 실시간 도착 정보와 날씨 정보를 제공하는 MSA(Microservices Architecture) 기반 애플리케이션입니다.

### 주요 특징
- ✅ **MSA 아키텍처**: 독립적으로 배포 가능한 마이크로서비스
- ✅ **클린 아키텍처**: 헥사고날 아키텍처 패턴 적용
- ✅ **Monorepo 전략**: 효율적인 코드 관리
- ✅ **API Gateway**: 단일 진입점을 통한 라우팅
- ✅ **독립 데이터베이스**: 각 서비스별 독립 DB

---

## 🏗️ 아키텍처

### 시스템 구조도

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend (React)                    │
│                    http://localhost:5173                 │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                   API Gateway (8080)                     │
│              Spring Cloud Gateway                        │
│  Routes:                                                 │
│    /api/subway/** → Subway Service                      │
│    /api/weather/** → Weather Service                    │
└──────────────┬──────────────────┬───────────────────────┘
               │                  │
       ┌───────▼────────┐  ┌─────▼──────────┐
       │ Subway Service │  │ Weather Service│
       │    (8081)      │  │     (8082)     │
       │                │  │                │
       │ - 지하철 도착정보 │  │ - 날씨 정보     │
       │ - 즐겨찾기 관리  │  │ - 지역 관리     │
       └────────┬───────┘  └────────┬───────┘
                │                   │
         ┌──────▼──────┐     ┌──────▼──────┐
         │  subway-db  │     │  weather-db │
         │    (H2)     │     │    (H2)     │
         └─────────────┘     └─────────────┘
```

### 기술 스택

| 계층 | 기술 |
|------|------|
| **Language** | Java 21 |
| **Framework** | Spring Boot 3.2.5 |
| **Gateway** | Spring Cloud Gateway 4.1.0 |
| **Database** | H2 (개발), PostgreSQL (운영 권장) |
| **Build Tool** | Gradle 8.x (Multi-Module) |
| **Container** | Docker, Docker Compose |
| **Architecture** | Clean Architecture (Hexagonal) |

---

## 📁 프로젝트 구조

```
egojeogo/
├── common/                          # 공통 라이브러리 모듈
│   └── src/main/java/com/egojeogo/common/
│       ├── exception/               # 공통 예외 처리
│       │   ├── ErrorCode.java
│       │   ├── CustomException.java
│       │   ├── ErrorResponse.java
│       │   └── GlobalExceptionHandler.java
│       └── config/                  # 공통 설정
│           └── WebMvcConfig.java
│
├── api-gateway/                     # API Gateway (8080)
│   ├── Dockerfile
│   └── src/main/
│       ├── java/com/egojeogo/gateway/
│       │   ├── ApiGatewayApplication.java
│       │   ├── config/
│       │   │   └── SecurityConfig.java
│       │   └── filter/
│       │       └── RequestLoggingGatewayFilterFactory.java
│       └── resources/
│           └── application.yml
│
├── subway-service/                  # 지하철 서비스 (8081)
│   ├── Dockerfile
│   └── src/main/
│       ├── java/com/egojeogo/subway/
│       │   ├── SubwayServiceApplication.java
│       │   ├── adapter/             # 어댑터 계층
│       │   │   ├── in/web/          # 컨트롤러
│       │   │   └── out/             # 외부 API, 영속성
│       │   ├── application/         # 애플리케이션 계층
│       │   │   ├── port/            # 포트 인터페이스
│       │   │   └── service/         # 비즈니스 로직
│       │   ├── domain/              # 도메인 모델
│       │   └── enums/               # 열거형
│       └── resources/
│           └── application.yml
│
├── weather-service/                 # 날씨 서비스 (8082)
│   ├── Dockerfile
│   └── src/main/
│       ├── java/com/egojeogo/weather/
│       │   ├── WeatherServiceApplication.java
│       │   ├── adapter/             # 어댑터 계층
│       │   ├── application/         # 애플리케이션 계층
│       │   └── domain/              # 도메인 모델
│       └── resources/
│           └── application.yml
│
├── frontend/                        # 프론트엔드 (React)
│
├── backend/                         # ⚠️ 레거시 (삭제 예정)
│
├── build.gradle                     # 루트 빌드 설정
├── settings.gradle                  # 멀티 모듈 설정
├── docker-compose.yml               # Docker Compose 설정
└── MSA-README.md                    # 이 문서
```

---

## 🚀 시작하기

### 사전 요구사항

- Java 21+
- Gradle 8.x
- Docker & Docker Compose (선택)

### 1️⃣ 로컬 개발 환경 (Gradle)

#### 전체 빌드
```bash
./gradlew build
```

#### 각 서비스 개별 실행

**터미널 1: API Gateway**
```bash
./gradlew :api-gateway:bootRun
# 🚪 API Gateway started on port 8080
```

**터미널 2: Subway Service**
```bash
./gradlew :subway-service:bootRun
# 🚇 Subway Service started on port 8081
```

**터미널 3: Weather Service**
```bash
./gradlew :weather-service:bootRun
# 🌤️ Weather Service started on port 8082
```

**터미널 4: Frontend**
```bash
cd frontend
npm install
npm run dev
# Frontend started on port 5173
```

### 2️⃣ Docker Compose로 실행

```bash
# 빌드 및 실행
docker-compose up --build

# 백그라운드 실행
docker-compose up -d

# 중지
docker-compose down

# 로그 확인
docker-compose logs -f
```

### 3️⃣ 헬스체크

```bash
# API Gateway
curl http://localhost:8080/actuator/health

# Subway Service
curl http://localhost:8081/actuator/health

# Weather Service
curl http://localhost:8082/actuator/health
```

---

## 📡 API 문서

### API Gateway 엔드포인트

모든 요청은 API Gateway(`http://localhost:8080`)를 통해 라우팅됩니다.

#### 🚇 Subway Service

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/subway/favorites` | 즐겨찾기 역 목록 조회 |
| POST | `/api/subway/favorites` | 즐겨찾기 역 등록 |
| PUT | `/api/subway/favorites` | 즐겨찾기 역 수정 |

**예시: 즐겨찾기 등록**
```bash
curl -X POST http://localhost:8080/api/subway/favorites \
  -H "Content-Type: application/json" \
  -d '{
    "stationName": "강남역",
    "line": "2호선",
    "upDownLine": "상행"
  }'
```

#### 🌤️ Weather Service

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/weather?region={지역명}` | 날씨 정보 조회 |

**예시: 날씨 조회**
```bash
curl http://localhost:8080/api/weather?region=서울
```

### 직접 서비스 호출 (개발용)

개발 중에는 API Gateway를 거치지 않고 직접 호출 가능:

```bash
# Subway Service 직접 호출
curl http://localhost:8081/favorites

# Weather Service 직접 호출
curl http://localhost:8082/weather?region=서울
```

---

## 🐳 배포

### Docker 이미지 빌드

```bash
# 개별 서비스 빌드
docker build -f api-gateway/Dockerfile -t egojeogo-gateway:latest .
docker build -f subway-service/Dockerfile -t egojeogo-subway:latest .
docker build -f weather-service/Dockerfile -t egojeogo-weather:latest .

# Docker Compose로 한 번에 빌드
docker-compose build
```

### Kubernetes 배포 (선택)

```yaml
# 예시: subway-service-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: subway-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: subway-service
  template:
    metadata:
      labels:
        app: subway-service
    spec:
      containers:
      - name: subway-service
        image: egojeogo-subway:latest
        ports:
        - containerPort: 8081
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: "prod"
```

---

## 🔄 마이그레이션 가이드

### 기존 모놀리식에서 MSA로 전환

#### 1단계: 프로젝트 빌드 확인

```bash
# 루트 디렉토리에서
./gradlew clean build

# 성공 시 다음 파일들이 생성됨:
# - common/build/libs/common-0.0.1-SNAPSHOT.jar
# - api-gateway/build/libs/api-gateway-0.0.1-SNAPSHOT.jar
# - subway-service/build/libs/subway-service-0.0.1-SNAPSHOT.jar
# - weather-service/build/libs/weather-service-0.0.1-SNAPSHOT.jar
```

#### 2단계: 서비스 실행 테스트

각 서비스를 순차적으로 실행하여 정상 동작 확인:

```bash
# 1. Subway Service 실행
./gradlew :subway-service:bootRun

# 2. Weather Service 실행 (새 터미널)
./gradlew :weather-service:bootRun

# 3. API Gateway 실행 (새 터미널)
./gradlew :api-gateway:bootRun
```

#### 3단계: Frontend 연동 변경

**기존 (모놀리식):**
```typescript
// frontend/src/lib/api.ts
const API_BASE_URL = 'http://localhost:8030/api';
```

**변경 (MSA):**
```typescript
// frontend/src/lib/api.ts
const API_BASE_URL = 'http://localhost:8080/api';
```

#### 4단계: 기존 backend 폴더 제거

모든 테스트가 완료되면:

```bash
# 백업 (선택)
mv backend backend-legacy-backup

# 또는 삭제
rm -rf backend
```

#### 5단계: settings.gradle 업데이트

```gradle
rootProject.name = 'egojeogo'

include 'common'
include 'subway-service'
include 'weather-service'
include 'api-gateway'

// 'backend' 제거
```

---

## 🛠️ 개발 가이드

### 새로운 서비스 추가하기

1. **서비스 디렉토리 생성**
```bash
mkdir -p new-service/src/main/java/com/egojeogo/newservice
mkdir -p new-service/src/main/resources
```

2. **build.gradle 작성**
```gradle
plugins {
    id 'org.springframework.boot'
}

dependencies {
    implementation project(':common')
    implementation 'org.springframework.boot:spring-boot-starter-web'
    // ... 기타 의존성
}
```

3. **settings.gradle에 추가**
```gradle
include 'new-service'
```

4. **Application 클래스 작성**
```java
@SpringBootApplication
@ComponentScan(basePackages = {"com.egojeogo.newservice", "com.egojeogo.common"})
public class NewServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(NewServiceApplication.class, args);
    }
}
```

5. **API Gateway에 라우트 추가**
```yaml
# api-gateway/src/main/resources/application.yml
spring:
  cloud:
    gateway:
      routes:
        - id: new-service
          uri: http://localhost:8083
          predicates:
            - Path=/api/new/**
```

### 공통 모듈 수정 시

```bash
# common 모듈 수정 후
./gradlew :common:build

# 영향받는 모든 서비스 재빌드
./gradlew build
```

---

## 📊 모니터링

### Actuator 엔드포인트

각 서비스는 Spring Boot Actuator를 통해 헬스체크 및 메트릭을 제공합니다:

```bash
# Health Check
curl http://localhost:8080/actuator/health
curl http://localhost:8081/actuator/health
curl http://localhost:8082/actuator/health

# Gateway Routes 확인
curl http://localhost:8080/actuator/gateway/routes
```

---

## 🐛 트러블슈팅

### 1. 포트 충돌
```bash
# 포트 사용 중인 프로세스 확인 (Windows)
netstat -ano | findstr :8080
netstat -ano | findstr :8081
netstat -ano | findstr :8082

# 프로세스 종료
taskkill /PID <PID> /F
```

### 2. Gradle 빌드 실패
```bash
# Gradle 캐시 삭제
./gradlew clean
rm -rf .gradle

# 다시 빌드
./gradlew build --refresh-dependencies
```

### 3. Docker 빌드 실패
```bash
# Docker 캐시 삭제 후 재빌드
docker-compose build --no-cache

# 로그 확인
docker-compose logs -f
```

### 4. 서비스 간 통신 실패

- API Gateway가 먼저 실행되었는지 확인
- 각 서비스의 포트가 올바른지 확인
- 방화벽 설정 확인

---

## 📚 참고 자료

- [Spring Cloud Gateway 공식 문서](https://spring.io/projects/spring-cloud-gateway)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Microservices Patterns](https://microservices.io/patterns/index.html)
- [Monorepo vs Polyrepo](https://github.com/joelparkerhenderson/monorepo-vs-polyrepo)

---

## 👥 기여

프로젝트에 기여하고 싶으시다면:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

---

## 📧 문의

프로젝트 관련 문의사항이 있으시면 이슈를 등록해주세요.

**Happy Coding! 🚀**
