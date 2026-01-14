package com.egojeogo.weather.domain.model;

import lombok.Getter;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Getter
@AllArgsConstructor
@Builder
public class Weather {

    private final String baseDate;
    private final String baseTime;
    private final String fcstDate;
    private final String fcstTime;
    private final double temperature;//기온
    private final double temperatureMax;//최고 기온
    private final double temperatureMin;//최저 기온
    private final int skyCode;//하늘 상태 코드
    private final int rainCode;//강수 상태 코드
    private final double rainAmount;//강수량
    private final double humidity;//습도
    private final double windSpeed;//바람 속도

    public String getWindStrength() {
        if (windSpeed < 4) return "약한";
        if (windSpeed < 9) return "약간 강한";
        if (windSpeed < 14) return "강한";
        return "매우 강한";
    }

    public String getSkyStatus() {
        return switch (skyCode) {
            case 1 -> "맑음";
            case 3 -> "구름 많음";
            case 4 -> "흐림";
            default -> "구름 조금";
        };
    }

    public String getRainStatus() {
        return switch (rainCode) {
            case 1 -> "비";
            case 2 -> "비/눈";
            case 3 -> "눈";
            case 4 -> "소나기";
            default -> "강수 없음";
        };
    }

    public boolean isNight() {
        int hour = Integer.parseInt(fcstTime.substring(0, 2));
        return hour >= 18 || hour <= 6; // 오후 6시 이후~오전 6시 이전
    }
}
