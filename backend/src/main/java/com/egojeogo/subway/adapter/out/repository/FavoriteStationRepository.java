package com.egojeogo.subway.adapter.out.repository;

import com.egojeogo.subway.domain.model.FavoriteStation;
public interface FavoriteStationRepository {
    void save(FavoriteStation favoriteStation);
    FavoriteStation findAll();
}
