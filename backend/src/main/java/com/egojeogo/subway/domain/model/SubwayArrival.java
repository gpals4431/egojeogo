package com.egojeogo.subway.domain.model;

import lombok.Getter;

@Getter
public class SubwayArrival {
    private String subwayId;      // 호선 ID (1001=1호선, 1002=2호선 등)
    private String subwayName;    // 호선 이름
    private String updnLine;      // 상행/하행
    private String trainLineNm;   // 열차 노선명 (종착역행 - 방면)
    private String statnNm;       // 현재 역명
    private String bstatnNm;      // 종착역명
    private String arvlMsg2;      // 첫번째도착메세지(도착, 출발 , 진입 등)
    private String arvlMsg3;      // 두번째도착메세지(종합운동장 도착, 12분 후 (광명사거리) 등)
    private String btrainSttus;   // 열차 상태 (일반/급행)
    private String btrainNo;      // 열차 번호
    
    // 호선 ID를 호선 이름으로 변환
    public static String getSubwayNameById(String subwayId) {
        return switch (subwayId) {
            case "1001" -> "1호선";
            case "1002" -> "2호선";
            case "1003" -> "3호선";
            case "1004" -> "4호선";
            case "1005" -> "5호선";
            case "1006" -> "6호선";
            case "1007" -> "7호선";
            case "1008" -> "8호선";
            case "1009" -> "9호선";
            case "1063" -> "경의중앙선";
            case "1065" -> "공항철도";
            case "1067" -> "경춘선";
            case "1075" -> "수인분당선";
            case "1077" -> "신분당선";
            default -> subwayId + "호선";
        };
    }
}

