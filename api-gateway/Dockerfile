# API Gateway Dockerfile
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /app

# Gradle 래퍼 및 빌드 파일 복사
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .

# 모든 모듈 복사
COPY common common
COPY api-gateway api-gateway

# 빌드 (api-gateway만)
RUN ./gradlew :api-gateway:bootJar --no-daemon

# 실행 단계
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# 빌드된 JAR 복사
COPY --from=builder /app/api-gateway/build/libs/*.jar app.jar

# 포트 노출
EXPOSE 8080

# 실행
ENTRYPOINT ["java", "-jar", "app.jar"]
