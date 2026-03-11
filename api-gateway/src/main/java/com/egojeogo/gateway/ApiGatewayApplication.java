package com.egojeogo.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * API Gateway 애플리케이션
 * 모든 마이크로서비스의 단일 진입점
 * Port: 8080
 * 
 * 라우팅:
 * - /api/subway/** -> subway-service (8081)
 * - /api/weather/** -> weather-service (8082)
 */
@SpringBootApplication
public class ApiGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
        System.out.println("🚪 API Gateway started on port 8080");
        System.out.println("📍 Routes:");
        System.out.println("   - /api/subway/** -> http://localhost:8081");
        System.out.println("   - /api/weather/** -> http://localhost:8082");
    }
}
