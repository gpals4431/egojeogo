package com.egojeogo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 프론트엔드 빌드 파일 서빙 (h2-console 제외)
        registry.addResourceHandler("/static/**", "/assets/**", "/*.js", "/*.css", "/*.html", "/*.ico")
                .addResourceLocations("classpath:/static/", "classpath:/public/")
                .resourceChain(false);
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // SPA 라우팅을 위한 설정 - 모든 경로를 index.html로 리다이렉트
        registry.addViewController("/").setViewName("forward:/index.html");
    }
}