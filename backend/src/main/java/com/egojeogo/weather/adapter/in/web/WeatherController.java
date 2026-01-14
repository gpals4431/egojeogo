package com.egojeogo.weather.adapter.in.web;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestParam;
import com.egojeogo.weather.adapter.in.dto.response.WeatherResponse;
import java.util.List;
import com.egojeogo.weather.application.port.in.WeatherUseCase;

@RestController
@RequiredArgsConstructor
@Slf4j
public class WeatherController {
    private final WeatherUseCase weatherUseCase;

    @GetMapping("/weather")
    public ResponseEntity<List<WeatherResponse>> getWeather(@RequestParam("lat") double lat, @RequestParam("lon") double lon) {
        
        List<WeatherResponse> responses = weatherUseCase.getWeathers(lat, lon);
        return ResponseEntity.ok(responses);
    }
    
}
