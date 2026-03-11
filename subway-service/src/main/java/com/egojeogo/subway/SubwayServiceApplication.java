package com.egojeogo.subway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 * Subway 마이크로서비스 애플리케이션
 * Port: 8081
 */
@SpringBootApplication
@ComponentScan(basePackages = {"com.egojeogo.subway", "com.egojeogo.common"})
@EnableJpaRepositories(basePackages = "com.egojeogo.subway")
@EntityScan(basePackages = "com.egojeogo.subway")
public class SubwayServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(SubwayServiceApplication.class, args);
        System.out.println("🚇 Subway Service started on port 8081");
    }
}
