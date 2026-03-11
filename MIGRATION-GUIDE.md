# 🔄 MSA 마이그레이션 가이드

## 📋 목차
1. [마이그레이션 개요](#마이그레이션-개요)
2. [변경 사항 요약](#변경-사항-요약)
3. [단계별 마이그레이션](#단계별-마이그레이션)
4. [검증 및 테스트](#검증-및-테스트)
5. [롤백 계획](#롤백-계획)
6. [FAQ](#faq)

---

## 🎯 마이그레이션 개요

### Before (모놀리식)
```
backend/ (단일 애플리케이션)
├── src/main/java/com/egojeogo/
│   ├── config/
│   ├── exception/
│   ├── subway/
│   └── weather/
└── Port: 8030
```

### After (MSA)
```
egojeogo/
├── common/              (공통 라이브러리)
├── api-gateway/         (Port: 8080)
├── subway-service/      (Port: 8081)
└── weather-service/     (Port: 8082)
```

---

## 📊 변경 사항 요약

### 1. 프로젝트 구조

| 항목 | Before | After |
|------|--------|-------|
| **저장소 구조** | 단일 backend 폴더 | Multi-Module Gradle |
| **실행 방식** | 1개 프로세스 | 3개 독립 프로세스 |
| **포트** | 8030 | 8080 (Gateway), 8081 (Subway), 8082 (Weather) |
| **데이터베이스** | 공유 DB (testdb) | 독립 DB (subway-db, weather-db) |
| **배포 단위** | 전체 재배포 | 서비스별 독립 배포 |

### 2. 코드 변경

#### 공통 모듈 (common/)
- ✅ `exception/` → `common/exception/`
- ✅ `WebMvcConfig` → `common/config/`
- ✅ `SecurityConfig` → 각 서비스별 독립 설정

#### Subway Service
- ✅ `com.egojeogo.subway.*` → 그대로 유지
- ✅ `import com.egojeogo.exception` → `import com.egojeogo.common.exception`
- ✅ Port: 8030 → 8081

#### Weather Service
- ✅ `com.egojeogo.weather.*` → 그대로 유지
- ✅ `import com.egojeogo.exception` → `import com.egojeogo.common.exception`
- ✅ Port: 8030 → 8082

#### API Gateway (신규)
- ✅ 라우팅 설정
- ✅ CORS 설정
- ✅ 로깅 필터

### 3. 설정 파일 변경

#### application.yml

**Before:**
```yaml
server:
  port: 8030
  servlet:
    context-path: /api
```

**After (Subway Service):**
```yaml
server:
  port: 8081
  servlet:
    context-path: /

spring:
  datasource:
    url: jdbc:h2:file:./data/subway-db
```

**After (Weather Service):**
```yaml
server:
  port: 8082
  servlet:
    context-path: /

spring:
  datasource:
    url: jdbc:h2:file:./data/weather-db
```

### 4. Frontend 변경

**Before:**
```typescript
const API_BASE_URL = 'http://localhost:8030/api';

// 직접 호출
fetch(`${API_BASE_URL}/favorites`)
fetch(`${API_BASE_URL}/weather?region=서울`)
```

**After:**
```typescript
const API_BASE_URL = 'http://localhost:8080/api';

// API Gateway를 통한 호출
fetch(`${API_BASE_URL}/subway/favorites`)
fetch(`${API_BASE_URL}/weather?region=서울`)
```

---

## 🚀 단계별 마이그레이션

### Phase 1: 준비 단계 (30분)

#### 1.1 Git 브랜치 생성
```bash
git checkout -b feature/msa-migration
git add .
git commit -m "Backup before MSA migration"
```

#### 1.2 기존 서비스 백업
```bash
# 기존 backend 폴더 백업
cp -r backend backend-backup-$(date +%Y%m%d)
```

#### 1.3 의존성 확인
```bash
cd backend
./gradlew dependencies > dependencies-before.txt
```

---

### Phase 2: MSA 구조 구축 (1시간)

#### 2.1 루트 Gradle 설정

**파일: `settings.gradle`**
```gradle
rootProject.name = 'egojeogo'

include 'common'
include 'subway-service'
include 'weather-service'
include 'api-gateway'
include 'backend'  // 임시로 유지
```

**파일: `build.gradle`**
```gradle
plugins {
    id 'java'
    id 'org.springframework.boot' version '3.2.5' apply false
    id 'io.spring.dependency-management' version '1.1.7' apply false
}

allprojects {
    group = 'com.egojeogo'
    version = '0.0.1-SNAPSHOT'
    
    repositories {
        mavenCentral()
    }
}

subprojects {
    apply plugin: 'java'
    apply plugin: 'io.spring.dependency-management'
    
    java {
        toolchain {
            languageVersion = JavaLanguageVersion.of(21)
        }
    }
    
    dependencyManagement {
        imports {
            mavenBom org.springframework.boot.gradle.plugin.SpringBootPlugin.BOM_COORDINATES
        }
    }
    
    dependencies {
        compileOnly 'org.projectlombok:lombok'
        annotationProcessor 'org.projectlombok:lombok'
        testImplementation 'org.springframework.boot:spring-boot-starter-test'
    }
    
    tasks.withType(JavaCompile) {
        options.encoding = 'UTF-8'
    }
    
    tasks.named('test') {
        useJUnitPlatform()
    }
}
```

#### 2.2 Common 모듈 생성

```bash
mkdir -p common/src/main/java/com/egojeogo/common/exception
mkdir -p common/src/main/java/com/egojeogo/common/config
```

**파일: `common/build.gradle`**
```gradle
plugins {
    id 'java-library'
}

tasks.named('jar') {
    enabled = true
}

dependencies {
    api 'org.springframework.boot:spring-boot-starter-web'
    api 'org.springframework.boot:spring-boot-starter-validation'
    api 'jakarta.validation:jakarta.validation-api'
    api 'org.hibernate.validator:hibernate-validator'
}
```

#### 2.3 서비스 모듈 생성

**Subway Service:**
```bash
mkdir -p subway-service/src/main/java/com/egojeogo/subway
mkdir -p subway-service/src/main/resources

# 기존 코드 복사
cp -r backend/src/main/java/com/egojeogo/subway/* subway-service/src/main/java/com/egojeogo/subway/
```

**Weather Service:**
```bash
mkdir -p weather-service/src/main/java/com/egojeogo/weather
mkdir -p weather-service/src/main/resources

# 기존 코드 복사
cp -r backend/src/main/java/com/egojeogo/weather/* weather-service/src/main/java/com/egojeogo/weather/
```

#### 2.4 API Gateway 생성

```bash
mkdir -p api-gateway/src/main/java/com/egojeogo/gateway
mkdir -p api-gateway/src/main/resources
```

**파일: `api-gateway/build.gradle`**
```gradle
plugins {
    id 'org.springframework.boot'
}

dependencies {
    implementation project(':common')
    implementation 'org.springframework.cloud:spring-cloud-starter-gateway:4.1.0'
    implementation 'org.springframework.boot:spring-boot-starter-actuator'
    implementation 'org.springframework.boot:spring-boot-starter-webflux'
}
```

---

### Phase 3: 빌드 및 테스트 (30분)

#### 3.1 전체 빌드
```bash
# 루트 디렉토리에서
./gradlew clean build

# 예상 결과:
# BUILD SUCCESSFUL in 1m 23s
```

#### 3.2 개별 서비스 빌드 확인
```bash
./gradlew :common:build
./gradlew :subway-service:build
./gradlew :weather-service:build
./gradlew :api-gateway:build
```

#### 3.3 JAR 파일 확인
```bash
ls -lh common/build/libs/
ls -lh subway-service/build/libs/
ls -lh weather-service/build/libs/
ls -lh api-gateway/build/libs/
```

---

### Phase 4: 실행 및 검증 (30분)

#### 4.1 서비스 순차 실행

**터미널 1: Subway Service**
```bash
./gradlew :subway-service:bootRun

# 확인:
# 🚇 Subway Service started on port 8081
```

**터미널 2: Weather Service**
```bash
./gradlew :weather-service:bootRun

# 확인:
# 🌤️ Weather Service started on port 8082
```

**터미널 3: API Gateway**
```bash
./gradlew :api-gateway:bootRun

# 확인:
# 🚪 API Gateway started on port 8080
```

#### 4.2 헬스체크
```bash
# 각 서비스 헬스체크
curl http://localhost:8081/actuator/health
curl http://localhost:8082/actuator/health
curl http://localhost:8080/actuator/health

# 예상 결과: {"status":"UP"}
```

#### 4.3 API 테스트

**Subway Service (직접 호출):**
```bash
curl http://localhost:8081/favorites
```

**Subway Service (Gateway 경유):**
```bash
curl http://localhost:8080/api/subway/favorites
```

**Weather Service (직접 호출):**
```bash
curl "http://localhost:8082/weather?region=서울"
```

**Weather Service (Gateway 경유):**
```bash
curl "http://localhost:8080/api/weather?region=서울"
```

---

### Phase 5: Frontend 연동 (15분)

#### 5.1 API 클라이언트 수정

**파일: `frontend/src/lib/api.ts`**

**Before:**
```typescript
const API_BASE_URL = 'http://localhost:8030/api';

export const subwayApi = {
  getFavorites: () => fetch(`${API_BASE_URL}/favorites`),
};

export const weatherApi = {
  getWeather: (region: string) => 
    fetch(`${API_BASE_URL}/weather?region=${region}`),
};
```

**After:**
```typescript
const API_BASE_URL = 'http://localhost:8080/api';

export const subwayApi = {
  getFavorites: () => fetch(`${API_BASE_URL}/subway/favorites`),
};

export const weatherApi = {
  getWeather: (region: string) => 
    fetch(`${API_BASE_URL}/weather?region=${region}`),
};
```

#### 5.2 Frontend 실행 및 테스트
```bash
cd frontend
npm install
npm run dev

# 브라우저에서 http://localhost:5173 접속
# 모든 기능 정상 동작 확인
```

---

### Phase 6: Docker 배포 (선택, 30분)

#### 6.1 Docker Compose 실행
```bash
# 루트 디렉토리에서
docker-compose up --build

# 또는 백그라운드 실행
docker-compose up -d
```

#### 6.2 컨테이너 상태 확인
```bash
docker-compose ps

# 예상 결과:
# egojeogo-api-gateway      Up      0.0.0.0:8080->8080/tcp
# egojeogo-subway-service   Up      0.0.0.0:8081->8081/tcp
# egojeogo-weather-service  Up      0.0.0.0:8082->8082/tcp
```

#### 6.3 로그 확인
```bash
docker-compose logs -f api-gateway
docker-compose logs -f subway-service
docker-compose logs -f weather-service
```

---

### Phase 7: 정리 (15분)

#### 7.1 기존 backend 폴더 제거

**⚠️ 주의: 모든 테스트가 완료된 후에만 실행**

```bash
# settings.gradle에서 backend 제거
# include 'backend' 라인 삭제

# 폴더 삭제
rm -rf backend

# 또는 보관
mv backend backend-legacy-archived
```

#### 7.2 Git 커밋
```bash
git add .
git commit -m "feat: Migrate to MSA architecture

- Add multi-module Gradle structure
- Create common module for shared code
- Split into subway-service and weather-service
- Add API Gateway for routing
- Update frontend to use new API endpoints
"

git push origin feature/msa-migration
```

#### 7.3 PR 생성 및 리뷰
- GitHub/GitLab에서 Pull Request 생성
- 팀원 리뷰 요청
- CI/CD 파이프라인 확인

---

## ✅ 검증 및 테스트

### 기능 테스트 체크리스트

- [ ] Subway Service
  - [ ] 즐겨찾기 역 조회
  - [ ] 즐겨찾기 역 등록
  - [ ] 즐겨찾기 역 수정
  - [ ] 실시간 도착 정보 조회

- [ ] Weather Service
  - [ ] 지역별 날씨 조회
  - [ ] 지역 정보 조회

- [ ] API Gateway
  - [ ] Subway 라우팅
  - [ ] Weather 라우팅
  - [ ] CORS 설정
  - [ ] 로깅

- [ ] Frontend
  - [ ] 지하철 정보 표시
  - [ ] 날씨 정보 표시
  - [ ] 에러 처리

### 성능 테스트

```bash
# Apache Bench로 부하 테스트
ab -n 1000 -c 10 http://localhost:8080/api/subway/favorites
ab -n 1000 -c 10 http://localhost:8080/api/weather?region=서울
```

### 통합 테스트

```bash
# 전체 서비스 통합 테스트
./gradlew test

# 개별 서비스 테스트
./gradlew :subway-service:test
./gradlew :weather-service:test
```

---

## 🔙 롤백 계획

### 즉시 롤백 (긴급)

```bash
# 1. 서비스 중지
docker-compose down
# 또는
pkill -f "subway-service"
pkill -f "weather-service"
pkill -f "api-gateway"

# 2. 기존 backend 실행
cd backend
./gradlew bootRun

# 3. Frontend API URL 복원
# frontend/src/lib/api.ts에서
# API_BASE_URL을 'http://localhost:8030/api'로 변경
```

### Git 롤백

```bash
# 커밋 전
git checkout .
git clean -fd

# 커밋 후
git revert HEAD
git push origin feature/msa-migration

# 또는 강제 롤백 (주의!)
git reset --hard HEAD~1
```

---

## ❓ FAQ

### Q1: 기존 데이터는 어떻게 되나요?

**A:** 각 서비스가 독립 데이터베이스를 사용합니다:
- `backend/data/testdb.mv.db` → 기존 데이터
- `subway-service/data/subway-db.mv.db` → 새 DB (마이그레이션 필요)
- `weather-service/data/weather-db.mv.db` → 새 DB (마이그레이션 필요)

데이터 마이그레이션:
```bash
# H2 Console 접속하여 데이터 Export/Import
# 또는 SQL 스크립트 작성
```

### Q2: 개발 중에는 어떻게 실행하나요?

**A:** 3가지 방법:

**방법 1: Gradle (추천)**
```bash
./gradlew :subway-service:bootRun
./gradlew :weather-service:bootRun
./gradlew :api-gateway:bootRun
```

**방법 2: Docker Compose**
```bash
docker-compose up
```

**방법 3: IDE (IntelliJ/Eclipse)**
- 각 서비스의 Application 클래스를 개별 실행

### Q3: 포트를 변경하고 싶어요

**A:** 각 서비스의 `application.yml` 수정:

```yaml
# subway-service/src/main/resources/application.yml
server:
  port: 9001  # 원하는 포트

# api-gateway/src/main/resources/application.yml
spring:
  cloud:
    gateway:
      routes:
        - id: subway-service
          uri: http://localhost:9001  # 변경된 포트
```

### Q4: 새로운 서비스를 추가하려면?

**A:** [MSA-README.md](./MSA-README.md)의 "새로운 서비스 추가하기" 섹션 참조

### Q5: 프로덕션 배포는 어떻게 하나요?

**A:** 

**Option 1: Docker**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

**Option 2: Kubernetes**
```bash
kubectl apply -f k8s/
```

**Option 3: 개별 서버**
```bash
# 각 서버에서
java -jar subway-service-0.0.1-SNAPSHOT.jar
java -jar weather-service-0.0.1-SNAPSHOT.jar
java -jar api-gateway-0.0.1-SNAPSHOT.jar
```

### Q6: 성능이 떨어지지 않나요?

**A:** 
- **네트워크 오버헤드**: 있지만 미미함 (수 ms)
- **독립 확장**: 트래픽 많은 서비스만 스케일 아웃 가능
- **캐싱**: Redis 등으로 성능 개선 가능

벤치마크:
- 모놀리식: ~50ms
- MSA (Gateway 경유): ~55ms (+10%)
- 트레이드오프: 유지보수성, 확장성 향상

### Q7: 로컬에서 모든 서비스를 실행해야 하나요?

**A:** 아니요! 필요한 서비스만 실행 가능:

```bash
# Subway 기능만 개발 중이라면
./gradlew :subway-service:bootRun

# 직접 호출
curl http://localhost:8081/favorites
```

### Q8: Common 모듈을 수정하면?

**A:** 영향받는 모든 서비스 재빌드:

```bash
# common 수정 후
./gradlew :common:build

# 전체 재빌드
./gradlew build

# 또는 개별 재빌드
./gradlew :subway-service:build
./gradlew :weather-service:build
```

---

## 📞 지원

마이그레이션 중 문제가 발생하면:

1. **로그 확인**
```bash
# Gradle 실행 시
./gradlew :subway-service:bootRun --info

# Docker 실행 시
docker-compose logs -f
```

2. **이슈 등록**
   - GitHub Issues에 상세 내용 작성
   - 에러 로그 첨부

3. **롤백**
   - 위의 "롤백 계획" 섹션 참조

---

## 🎉 마이그레이션 완료!

축하합니다! MSA 아키텍처로 성공적으로 전환했습니다.

다음 단계:
- [ ] 모니터링 도구 추가 (Prometheus, Grafana)
- [ ] 로깅 중앙화 (ELK Stack)
- [ ] CI/CD 파이프라인 구축
- [ ] 서비스 메시 도입 (Istio, Linkerd)
- [ ] 분산 추적 (Zipkin, Jaeger)

**Happy Coding! 🚀**
