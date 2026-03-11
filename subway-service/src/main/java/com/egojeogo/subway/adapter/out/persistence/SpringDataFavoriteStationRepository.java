package com.egojeogo.subway.adapter.out.persistence;
import com.egojeogo.subway.adapter.out.persistence.entity.FavoriteStationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataFavoriteStationRepository
        extends JpaRepository<FavoriteStationEntity, Long> {
}
