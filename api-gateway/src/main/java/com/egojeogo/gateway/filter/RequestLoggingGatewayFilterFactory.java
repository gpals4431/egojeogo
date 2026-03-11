package com.egojeogo.gateway.filter;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

/**
 * 요청 로깅 필터
 * 모든 요청에 대한 로그를 남깁니다
 */
@Slf4j
@Component
public class RequestLoggingGatewayFilterFactory 
        extends AbstractGatewayFilterFactory<RequestLoggingGatewayFilterFactory.Config> {

    public RequestLoggingGatewayFilterFactory() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            long startTime = System.currentTimeMillis();
            String path = exchange.getRequest().getPath().toString();
            String method = exchange.getRequest().getMethod().toString();
            
            log.info("🔵 [Gateway] {} {} - Request started", method, path);
            
            return chain.filter(exchange)
                    .then(Mono.fromRunnable(() -> {
                        long duration = System.currentTimeMillis() - startTime;
                        int statusCode = exchange.getResponse().getStatusCode() != null 
                                ? exchange.getResponse().getStatusCode().value() 
                                : 0;
                        
                        log.info("🟢 [Gateway] {} {} - Response: {} ({}ms)", 
                                method, path, statusCode, duration);
                    }));
        };
    }

    public static class Config {
        // 필요시 설정 추가
    }
}
