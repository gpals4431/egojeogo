package com.egojeogo.weather.adapter.out.api;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class WeatherApiDto {
    private String baseDate;
    private String baseTime;
    private String fcstTime;
    private String fcstDate;
    private String category;
    private Object fcstValue; // string, double, int 전부 가능 
}
