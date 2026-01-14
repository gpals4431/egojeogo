package com.egojeogo.weather.adapter.in.dto.response;

import com.egojeogo.weather.domain.model.Weather;
import lombok.Getter;
import lombok.Builder;

@Getter
@Builder
public class WeatherResponse {
    private String baseDate;
    private String baseTime;
    private String fcstDate;
    private String fcstTime;
    private double temperature;
    private double temperatureMax;
    private double temperatureMin;
    private double humidity;
    private double rainAmount;
    private String skyStatus;
    private String rainStatus;
    private String windStatus;
    private boolean isNight;
    private String regionParent;
    private String regionChild;

    public static WeatherResponse from(Weather weather, String regionParent, String regionChild) {
        return WeatherResponse.builder()
            .baseDate(weather.getBaseDate())
            .baseTime(weather.getBaseTime())
            .fcstDate(weather.getFcstDate())
            .fcstTime(weather.getFcstTime())
            .temperature(weather.getTemperature())
            .temperatureMax(weather.getTemperatureMax())
            .temperatureMin(weather.getTemperatureMin())
            .humidity(weather.getHumidity())
            .rainAmount(weather.getRainAmount())
            .skyStatus(weather.getSkyStatus())
            .rainStatus(weather.getRainStatus())
            .windStatus(weather.getWindStrength())
            .isNight(weather.isNight())
            .regionParent(regionParent)
            .regionChild(regionChild)
            .build();
    }
}