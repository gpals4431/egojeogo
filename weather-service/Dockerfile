# Weather Service Dockerfile
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /app

# Gradle 래퍼 및 빌드 파일 복사
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .

# 모든 모듈 복사
COPY common common
COPY weather-service weather-service

# 빌드 (weather-service만)
RUN ./gradlew :weather-service:bootJar --no-daemon

# 실행 단계
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# 빌드된 JAR 복사
COPY --from=builder /app/weather-service/build/libs/*.jar app.jar

# 데이터 디렉토리 생성
RUN mkdir -p /app/data

# 포트 노출
EXPOSE 8082

# 실행
ENTRYPOINT ["java", "-jar", "app.jar"]
