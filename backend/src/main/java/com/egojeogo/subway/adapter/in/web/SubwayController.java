package com.egojeogo.subway.adapter.in.web;

import com.egojeogo.subway.application.service.SubwayService;
import com.egojeogo.subway.domain.model.FavoriteStation;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.egojeogo.subway.adapter.in.web.dto.request.FavoriteStationRequest;

import com.egojeogo.subway.application.port.in.FavoriteStationUseCase;

import java.io.IOException;
import java.time.LocalDateTime;


@RestController
@RequestMapping("/subway")
@RequiredArgsConstructor
@Slf4j
/**
adapter/in 은 외부 -> 내부로 들어오는 요청 web (Controller)
usecase 를 호출하여 비즈니스 로직을 구현 다른 db, api 작성 x 
dto <-> domain 변환

 */
public class SubwayController {
    
    private final FavoriteStationUseCase favoriteStationUseCase;

    @GetMapping("/favorite-station")
    public ResponseEntity<FavoriteStation> getFavoriteStation() throws IOException {
        FavoriteStation response = favoriteStationUseCase.getFavoriteStation();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/favorite-station")
    public void register(@RequestBody FavoriteStationRequest request){
        FavoriteStation favoriteStation = new FavoriteStation(
            request.getStationName(), request.getUpLine(), LocalDateTime.now());

        favoriteStationUseCase.registerFavoriteStation(favoriteStation);
    }
}
