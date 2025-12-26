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
import com.egojeogo.subway.adapter.in.web.dto.response.SubwayArrivalResponse;
import java.util.List;

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
    public ResponseEntity<List<SubwayArrivalResponse>> getFavoriteStation() throws IOException {
        List<SubwayArrivalResponse> responses = favoriteStationUseCase.getFavoriteStation();
        return ResponseEntity.ok(responses);
    }

    @PostMapping("/favorite-station")
    public ResponseEntity<String> register(@RequestBody FavoriteStationRequest request){
        log.info("관심역 등록 요청 받음: {}", request);
        
        FavoriteStation favoriteStation = new FavoriteStation(
            "me", request.getStationName(), request.getUpDownLine(), request.getLine());

        favoriteStationUseCase.registerFavoriteStation(favoriteStation);
        
        log.info("관심역 등록 완료: {}", favoriteStation);
        return ResponseEntity.ok("등록 성공");
    }
}
