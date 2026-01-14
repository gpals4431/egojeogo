package com.egojeogo.weather.adapter.out.persistence.repo;

import com.egojeogo.weather.adapter.out.persistence.entity.RegionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;

public interface SpringDataRegionRepository extends JpaRepository<RegionEntity, Long> {
    @Query("SELECT r FROM RegionEntity r " +
           "WHERE TRUNCATE(r.latitude, 2) = :lat " +
           "AND TRUNCATE(r.longitude, 2) = :lon")
    Optional<RegionEntity> findTop1ByLatitudeAndLongitude(
        @Param("lat") double lat, 
        @Param("lon") double lon
    );
}
