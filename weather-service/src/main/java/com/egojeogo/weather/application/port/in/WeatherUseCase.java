package com.egojeogo.weather.application.port.in;

import com.egojeogo.weather.adapter.in.dto.response.WeatherResponse;
import java.util.List;
//실시간 기상청 api 가져오기 
public interface WeatherUseCase {
    List<WeatherResponse> getWeathers(double lat, double lon);
}
