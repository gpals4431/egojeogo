package com.egojeogo.subway.application.port.in;

import com.egojeogo.subway.domain.model.FavoriteStation;
/**
 * port/in 이 시스템이 제공하는 기능 목록
 * port는 외부에서 접근할때의 중간 역할 
 * 인터페이스는 어떤 기능을 하는지, 어떻게 동작하는지 작성 x
 * 그냥 기능이 있다는 것만 작성 
 * '기능 정의서' 라고 생각하면 좋음 !!
 */
public interface FavoriteStationUseCase {
    void registerFavoriteStation(FavoriteStation favoriteStation);
    void updateFavoriteStation(FavoriteStation favoriteStation);
    FavoriteStation getFavoriteStation();
}