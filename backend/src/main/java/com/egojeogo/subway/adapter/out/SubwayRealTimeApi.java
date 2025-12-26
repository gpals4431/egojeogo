package com.egojeogo.subway.adapter.out;

import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.io.BufferedReader;
import java.util.ArrayList;
import java.util.List;

import com.egojeogo.subway.adapter.out.dto.SubwayArrivalXmlResponse;
import com.egojeogo.subway.application.port.out.SubwayArrivalPort;
import com.egojeogo.subway.domain.model.SubwayArrival;
import com.egojeogo.subway.enums.SubwayEnum;
import com.egojeogo.subway.enums.SubwayLine;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;
import com.egojeogo.subway.domain.model.FavoriteStation;

@Component
@Slf4j
public class SubwayRealTimeApi implements SubwayArrivalPort {
    
    @Value("${seoul.subway.api.key}")
    private String apiKey;
    
    @Value("${seoul.subway.api.url}")
    private String apiUrl;
    
    private final XmlMapper xmlMapper = new XmlMapper();
    
    @Override
    public List<SubwayArrival> getSubwayRealTimeArrival(FavoriteStation favoriteStation) {
        try {
            // 1. API 호출 → XML 문자열 받기
            String xmlResponse = callApi(favoriteStation.getStationName());
            
            // 2. XML 파싱 → DTO로 변환
            SubwayArrivalXmlResponse response = xmlMapper.readValue(xmlResponse, SubwayArrivalXmlResponse.class);
            
            // 3. DTO → 도메인 모델로 변환
            return toDomainList(response, favoriteStation.getUpDownLine(), favoriteStation.getLine());
            
        } catch (Exception e) {
            log.error("get subway real time arrival api failed:{}", e.getMessage());
            return new ArrayList<>();
        }
    }
    
    // XML DTO → 도메인 모델 변환
    private List<SubwayArrival> toDomainList(SubwayArrivalXmlResponse response, String upDownLine, String line) {
        if (response.getRows() == null) {
            throw new RuntimeException("No data found");
        }
        return response.getRows().stream()
            .filter(row -> matchesDirection(row.getUpdnLine(), upDownLine))
            .filter(row -> matchesLine(row.getSubwayId(), line))
            .map(row -> new SubwayArrival(
                SubwayLine.fromId(row.getSubwayId()),
                row.getUpdnLine(),
                row.getTrainLineNm(),
                row.getStatnNm(),
                row.getBstatnNm(),
                row.getArvlMsg2(),
                row.getArvlMsg3(),
                row.getBtrainSttus(),
                row.getBtrainNo()
            ))
            .toList();
    }
    // 호선 매칭 (String line과 SubwayLine 비교)
    private boolean matchesLine(String subwayId, String line) {
        if (line == null || line.isEmpty()) {
            return true; // 필터 없으면 전체 반환
        }
        
        try {
            SubwayLine subwayLine = SubwayLine.fromId(subwayId);
            return subwayLine.getName().equals(line);  // "2호선".equals("2호선")
        } catch (IllegalArgumentException e) {
            return false; // 알 수 없는 호선 ID는 제외
        }
    }
    // 상행/하행 방향 매칭 (상행=외선, 하행=내선)
    private boolean matchesDirection(String rowUpdnLine, String userUpDownLine) {
        if (userUpDownLine == null || userUpDownLine.isEmpty()) {
            return true; // 필터 없으면 전체 반환
        }
        
        // 상행 요청 → 상행, 외선 모두 매칭
        if ("상행".equals(userUpDownLine)) {
            return "상행".equals(rowUpdnLine) || "외선".equals(rowUpdnLine);
        }
        
        // 하행 요청 → 하행, 내선 모두 매칭
        if ("하행".equals(userUpDownLine)) {
            return "하행".equals(rowUpdnLine) || "내선".equals(rowUpdnLine);
        }
        
        // 그 외는 정확히 일치하는 경우만
        return rowUpdnLine.equals(userUpDownLine);
    }
    
    // API 호출
    private String callApi(String station) throws Exception {
        String serviceName = SubwayEnum.SUBWAY_REAL_TIME_ARRIVAL.getValue();
        
        StringBuilder urlBuilder = new StringBuilder(apiUrl);
        urlBuilder.append("/" + URLEncoder.encode(apiKey, "UTF-8"));
        urlBuilder.append("/" + URLEncoder.encode("xml", "UTF-8"));
        urlBuilder.append("/" + URLEncoder.encode(serviceName, "UTF-8"));
        urlBuilder.append("/" + URLEncoder.encode("0", "UTF-8"));
        urlBuilder.append("/" + URLEncoder.encode("5", "UTF-8"));
        urlBuilder.append("/" + URLEncoder.encode(station, "UTF-8"));
        
        log.info("API 호출 URL: {}", urlBuilder);
        
        URL url = new URL(urlBuilder.toString());
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Content-type", "application/xml");
        
        BufferedReader rd;
        if (conn.getResponseCode() >= 200 && conn.getResponseCode() <= 300) {
            rd = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
        } else {
            rd = new BufferedReader(new InputStreamReader(conn.getErrorStream(), "UTF-8"));
        }
        
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = rd.readLine()) != null) {
            sb.append(line);
        }
        rd.close();
        conn.disconnect();
        
        return sb.toString();
    }
}
