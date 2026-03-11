package com.egojeogo.subway.application.port.out;

import com.egojeogo.subway.domain.model.FavoriteStation;
import java.util.List;

// DB에 대한 요구사항 데이터 베이스(외부)에 요청보내기 때문에 port out
public interface FavoriteStationRepository {
    void save(FavoriteStation favoriteStation);
    void update(FavoriteStation favoriteStation);
    List<FavoriteStation> findAll();
}
