package com.egojeogo.subway.adapter.out.persistence.mapper;

import com.egojeogo.subway.adapter.out.persistence.entity.FavoriteStationEntity;
import com.egojeogo.subway.domain.model.FavoriteStation;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
// 데이터 형태 변환 등 매퍼 클래스
@Component
public class FavoriteStationMapper {

    @NonNull
    public FavoriteStationEntity toEntity(FavoriteStation domain) {
        return FavoriteStationEntity.from(domain);
    }

    public FavoriteStation toDomain(FavoriteStationEntity entity) {
        return new FavoriteStation(
            entity.getUserId(),
            entity.getStationName(),
            entity.getLine(),
            entity.getUpDownLine()
        );
    }
}