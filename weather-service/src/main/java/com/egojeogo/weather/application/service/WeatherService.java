package com.egojeogo.weather.application.service;

import com.egojeogo.weather.application.port.in.WeatherUseCase;
import com.egojeogo.weather.application.port.out.WeatherPort;
import com.egojeogo.weather.adapter.in.dto.response.WeatherResponse;
import com.egojeogo.weather.application.port.out.RegionRepository;
import com.egojeogo.weather.domain.model.Weather;
import com.egojeogo.weather.domain.model.Region;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;
import lombok.RequiredArgsConstructor;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Transactional
@Slf4j
@Service
public class WeatherService implements WeatherUseCase {
    private final WeatherPort weatherPort;
    private final RegionRepository regionRepository;

    @Override
    public List<WeatherResponse> getWeathers(double lat, double lon) {
        log.info("lat: {}, lon: {}", lat, lon);
        double truncatedLat = (long)(lat * 100.0) / 100.0;
        double truncatedLon = (long)(lon * 100.0) / 100.0;

        Region region = regionRepository.findByLatitudeAndLongitude(truncatedLat, truncatedLon).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "해당 좌표의 지역 정보가 없습니다."));
        log.info("region: {}", region);
        List<Weather> weathers = weatherPort.getWeathers(region.getNx(), region.getNy());

        return weathers.stream()
            .map(weather -> WeatherResponse.from(weather, region.getRegionParent(), region.getRegionChild()))
            .collect(Collectors.toList());
    }
}
