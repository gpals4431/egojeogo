package com.egojeogo.subway.application.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import com.egojeogo.subway.application.port.in.FavoriteStationUseCase;
import com.egojeogo.subway.domain.model.FavoriteStation;

@Service
@RequiredArgsConstructor
@Slf4j
/* application 계층은 비즈니스 로직을 구현하는 계층으로 Port만 의존하며 기술 세부사항은 모름  */
public class SubwayService implements FavoriteStationUseCase{
    @Override
    public void registerFavoriteStation(FavoriteStation favoriteStation) {
        log.info("관심역 등록: {}", favoriteStation);
        throw new UnsupportedOperationException("Unimplemented method 'registerFavoriteStation'");
    }
    @Override
    public void updateFavoriteStation(FavoriteStation favoriteStation) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'updateFavoriteStation'");
    }
    @Override
    public FavoriteStation getFavoriteStation() {
        log.info("관심역 조회");
        
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getFavoriteStation'");
    }
}
