package com.egojeogo.weather.adapter.out.api;

import java.util.List;
import java.util.Map;
import java.util.Comparator;
import java.util.stream.Collectors;

import com.egojeogo.weather.domain.model.Weather;
public class WeatherApiMapper {

    public static List<Weather> toDomainList(List<WeatherApiDto> dtos) {
        // 1. 날짜와 시간을 합쳐서 그룹화합니다. (Map의 Key를 "날짜+시간"으로 설정)
        Map<String, List<WeatherApiDto>> groupedByTime = dtos.stream()
                .collect(Collectors.groupingBy(dto -> dto.getFcstDate() + dto.getFcstTime()));

        // 2. 그룹화된 각 묶음을 Weather 객체로 변환하여 리스트로 만듭니다.
        return groupedByTime.values().stream()
                .map(WeatherApiMapper::toDomain) // 아래에서 만든 단일 변환 메서드 사용
                .sorted(Comparator.comparing(Weather::getFcstDate) // 시간 순서대로 정렬
                        .thenComparing(Weather::getFcstTime))
                .collect(Collectors.toList());
    }

    // 단일 시간대 데이터를 Weather 객체로 만드는 메서드
    private static Weather toDomain(List<WeatherApiDto> timeGroup) {
        WeatherApiDto first = timeGroup.get(0);

        return Weather.builder()
                .baseDate(first.getBaseDate())
                .baseTime(first.getBaseTime())
                .fcstDate(first.getFcstDate())
                .fcstTime(first.getFcstTime())
                .skyCode(Integer.parseInt(getValue(timeGroup, "SKY", "0")))
                .rainCode(Integer.parseInt(getValue(timeGroup, "PTY", "0")))
                .temperature(Double.parseDouble(getValue(timeGroup, "TMP", "0.0")))
                .windSpeed(Double.parseDouble(getValue(timeGroup, "WSD", "0.0")))
                // 강수량(PCP)처럼 "강수없음" 같은 한글이 섞인 경우 처리가 필요합니다.
                .rainAmount(Double.parseDouble(parseRainAmount(getValue(timeGroup, "PCP", "0.0"))))
                .build();
    }

    private static String getValue(List<WeatherApiDto> dtos, String category, String defaultValue) {
        return dtos.stream()
                .filter(d -> d.getCategory().equals(category))
                .findFirst()
                .map(d -> d.getFcstValue().toString())
                .orElse(defaultValue);
    }

    // "강수없음" 문자열을 0.0으로 바꿔주는 안전장치
    private static String parseRainAmount(String value) {
        if (value.equals("강수없음")) return "0.0";
        return value.replaceAll("[^0-9.]", ""); // 숫자와 점 제외하고 모두 제거
    }
}