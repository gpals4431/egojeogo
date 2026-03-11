package com.egojeogo.subway.adapter.out.dto;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@JacksonXmlRootElement(localName = "realtimeStationArrival")
@JsonIgnoreProperties(ignoreUnknown = true)
public class SubwayArrivalXmlResponse {
    
    @JacksonXmlProperty(localName = "RESULT")
    private Result result;
    
    @JacksonXmlElementWrapper(useWrapping = false)
    @JacksonXmlProperty(localName = "row")
    private List<Row> rows;
    
    @Getter
    @NoArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Result {
        private String code;
        private String message;
        private int status;
        private int total;
    }
    
    @Getter
    @NoArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Row {
        private String subwayId;      // 호선 ID
        private String updnLine;      // 상행/하행
        private String trainLineNm;   // 열차 노선명
        private String statnNm;       // 역명
        private String bstatnNm;      // 종착역명
        private String arvlMsg2;      // 도착 메시지1
        private String arvlMsg3;      // 도착 메시지2
        private String btrainSttus;   // 열차 상태 (일반/급행)
        private String btrainNo;      // 열차 번호
    }
}

