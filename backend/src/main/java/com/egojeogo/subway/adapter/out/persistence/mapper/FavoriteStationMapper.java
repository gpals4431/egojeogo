package com.egojeogo.subway.adapter.out.persistence.mapper;

import com.egojeogo.subway.adapter.out.persistence.entity.FavoriteStationEntity;
import com.egojeogo.subway.domain.model.FavoriteStation;

// 데이터 형태 변환 등 매퍼 클래스
public class FavoriteStationMapper {

    public static FavoriteStationEntity toEntity(FavoriteStation domain) {
        return FavoriteStationEntity.from(domain);
    }

    public static FavoriteStation toDomain(FavoriteStationEntity entity) {
        return new FavoriteStation(
            entity.getUserId(),
            entity.getStationName(),
            entity.getLine(),
            entity.getUpDownLine()
        );
    }
}