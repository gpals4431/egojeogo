package com.egojeogo.weather;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 * Weather 마이크로서비스 애플리케이션
 * Port: 8082
 */
@SpringBootApplication
@ComponentScan(basePackages = {"com.egojeogo.weather", "com.egojeogo.common"})
@EnableJpaRepositories(basePackages = "com.egojeogo.weather")
@EntityScan(basePackages = "com.egojeogo.weather")
public class WeatherServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(WeatherServiceApplication.class, args);
        System.out.println("🌤️ Weather Service started on port 8082");
    }
}
