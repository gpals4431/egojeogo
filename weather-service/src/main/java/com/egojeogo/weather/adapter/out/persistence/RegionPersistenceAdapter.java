package com.egojeogo.weather.adapter.out.persistence;

import lombok.RequiredArgsConstructor;
import com.egojeogo.weather.adapter.out.persistence.repo.SpringDataRegionRepository;
import com.egojeogo.weather.application.port.out.RegionRepository;
import com.egojeogo.weather.adapter.out.persistence.mapper.RegionJpaMapper;
import com.egojeogo.weather.domain.model.Region;
import org.springframework.stereotype.Repository;
import java.util.Optional;

//Persistence Adapter : DB에 접근해 서비스가 원하는 모양으로 바꿔주는 중간 다리 역할 
@Repository
@RequiredArgsConstructor
public class RegionPersistenceAdapter implements RegionRepository { // 도메인 포트 구현

    private final SpringDataRegionRepository springDataRegionRepository; 
    private final RegionJpaMapper mapper; 

    @Override
    public Optional<Region> findByLatitudeAndLongitude(double latitude, double longitude) {
        return springDataRegionRepository.findTop1ByLatitudeAndLongitude(latitude, longitude)
            .map(mapper::toDomain);
    }
}