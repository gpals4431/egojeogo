package com.egojeogo.subway.adapter.out.persistence;

import java.util.List;
import java.util.ArrayList;
import com.egojeogo.subway.domain.model.FavoriteStation;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import com.egojeogo.subway.application.port.out.FavoriteStationRepository;
import com.egojeogo.subway.adapter.out.persistence.entity.FavoriteStationEntity;

//jpa, entity, mapper 사용 
@Repository
@RequiredArgsConstructor
public class FavoriteStationJpaRepository implements FavoriteStationRepository {
    private final SpringDataFavoriteStationRepository jpaRepository;

   @Override
    public void save(FavoriteStation favoriteStation) {
        FavoriteStationEntity entity =
            FavoriteStationEntity.from(favoriteStation);

        jpaRepository.save(entity);
    }

    @Override
    public List<FavoriteStation> findAll() {
        List<FavoriteStationEntity> entities = jpaRepository.findAll();
    
    if (entities.isEmpty()) {
        throw new RuntimeException("No favorite stations found");
    }
    
    return entities.stream()
        .map(FavoriteStationEntity::toDomain)
        .toList();
    }

    @Override
    public void update(FavoriteStation favoriteStation) {
        FavoriteStationEntity entity =
            FavoriteStationEntity.from(favoriteStation);

        jpaRepository.save(entity);
    }
    
}
