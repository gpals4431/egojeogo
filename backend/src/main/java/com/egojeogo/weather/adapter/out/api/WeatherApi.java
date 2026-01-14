package com.egojeogo.weather.adapter.out.api;

import com.egojeogo.weather.domain.model.Weather;
import com.egojeogo.weather.application.port.out.WeatherPort;
import java.util.List;
import java.util.ArrayList;
import org.springframework.stereotype.Component;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class WeatherApi implements WeatherPort {
    
    @Override
    public List<Weather> getWeathers(double lat, double lon) {
        // TODO: 실제 기상청 API 호출 로직 구현 필요
        // 현재는 순환 참조 해결을 위해 빈 리스트 반환
        // 실제 구현 시 WeatherApiMapper를 사용하여 WeatherApiDto를 Weather로 변환
        log.warn("WeatherApi.getWeathers() - 실제 API 호출 로직이 구현되지 않았습니다.");
        return new ArrayList<>();
    }
}
