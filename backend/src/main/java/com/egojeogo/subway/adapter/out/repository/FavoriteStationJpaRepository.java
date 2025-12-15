package com.egojeogo.subway.adapter.out.repository;

import com.egojeogo.subway.domain.model.FavoriteStation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.egojeogo.subway.adapter.out.repository.FavoriteStationRepository;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class FavoriteStationJpaRepository implements FavoriteStationRepository {
    private final JpaRepository<FavoriteStationEntity, Long> jpaRepository;
    @Override
    public void save(FavoriteStation favoriteStation) {
        // jpa 를 사용하여 저장
        FavoriteStationEntity entity = FavoriteStationEntity.from(favoriteStation);
        jpaRepository.save(entity);
    }
    @Override
    public FavoriteStation findAll() {
       return jpaRepository.findAll().stream()
       .map(FavoriteStationEntity::toDomain)
       .collect(Collectors.toList());
    
    }
}
