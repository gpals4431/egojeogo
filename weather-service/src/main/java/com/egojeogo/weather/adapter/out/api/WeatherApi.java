package com.egojeogo.weather.adapter.out.api;

import com.egojeogo.weather.domain.model.Weather;
import com.egojeogo.weather.application.port.out.WeatherPort;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import java.util.ArrayList;
import org.springframework.stereotype.Component;
import lombok.extern.slf4j.Slf4j;
import java.net.URL;
import java.net.URLEncoder;
import java.net.HttpURLConnection;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import org.springframework.beans.factory.annotation.Value;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Component
@Slf4j
public class WeatherApi implements WeatherPort {
    @Value("${weather.api.key}")
    private String apiKey;
    
    @Value("${weather.api.url}")
    private String apiUrl;
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    @Override
    public List<Weather> getWeathers(double lat, double lon) {
        try {
            // lat, lon을 int로 변환 (기상청 API는 nx, ny를 int로 받음)
            int nx = (int) lat;
            int ny = (int) lon;
            
            // 현재 시간 기준으로 가장 가까운 이전 발표 시간 계산
            LocalDateTime now = LocalDateTime.now();
            int[] forecastTimes = {2, 5, 8, 11, 14, 17, 20, 23};
            int baseHour = 2; // 기본값
            for (int time : forecastTimes) {
                if (now.getHour() >= time) {
                    baseHour = time;
                } else {
                    break;
                }
            }
            
            // 어제 23시인 경우 처리
            String baseDate = now.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
            String baseTime = String.format("%02d00", baseHour);
            if (baseHour == 2 && now.getHour() < 2) {
                // 새벽 2시 이전이면 전날 23시 데이터 사용
                baseDate = now.minusDays(1).format(DateTimeFormatter.ofPattern("yyyyMMdd"));
                baseTime = "2300";
            }
            
            // 쿼리 파라미터로 URL 구성
            StringBuilder urlBuilder = new StringBuilder(apiUrl);
            urlBuilder.append("serviceKey=").append(URLEncoder.encode(apiKey, "UTF-8"));
            urlBuilder.append("&numOfRows=1000");
            urlBuilder.append("&pageNo=1");
            urlBuilder.append("&dataType=json");
            urlBuilder.append("&base_date=").append(URLEncoder.encode(baseDate, "UTF-8"));
            urlBuilder.append("&base_time=").append(URLEncoder.encode(baseTime, "UTF-8"));
            urlBuilder.append("&nx=").append(URLEncoder.encode(String.valueOf(nx), "UTF-8"));
            urlBuilder.append("&ny=").append(URLEncoder.encode(String.valueOf(ny), "UTF-8"));
            
            log.info("API 호출 URL: {}", urlBuilder);
            
            URL url = new URL(urlBuilder.toString());
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Content-type", "application/json");
            
            // 응답 코드 확인
            BufferedReader rd;
            if (conn.getResponseCode() >= 200 && conn.getResponseCode() <= 300) {
                rd = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
            } else {
                rd = new BufferedReader(new InputStreamReader(conn.getErrorStream(), "UTF-8"));
                StringBuilder errorResponse = new StringBuilder();
                String line;
                while ((line = rd.readLine()) != null) {
                    errorResponse.append(line);
                }
                rd.close();
                conn.disconnect();
                log.error("API 호출 실패. 응답 코드: {}, 응답 내용: {}", conn.getResponseCode(), errorResponse.toString());
                return new ArrayList<>();
            }
            
            // 응답 읽기
            StringBuilder response = new StringBuilder();
            String line;
            while ((line = rd.readLine()) != null) {
                response.append(line);
            }
            rd.close();
            conn.disconnect();
            
            // JSON 파싱
            WeatherApiJsonResponse jsonResponse = objectMapper.readValue(response.toString(), WeatherApiJsonResponse.class);
            
            // DTO 리스트로 변환
            List<WeatherApiDto> dtos = jsonResponse.toDtoList();
            
            // 도메인 모델로 변환
            return WeatherApiMapper.toDomainList(dtos);
            
        } catch (Exception e) {
            log.error("날씨 API 호출 실패: {}", e.getMessage(), e);
            return new ArrayList<>();
        }
    }
    
}
