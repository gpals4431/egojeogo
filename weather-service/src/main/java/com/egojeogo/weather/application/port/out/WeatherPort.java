package com.egojeogo.weather.application.port.out;

import com.egojeogo.weather.domain.model.Weather;
import java.util.List;
public interface WeatherPort {
    List<Weather> getWeathers(double lat, double lon);
}
