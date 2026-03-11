package com.egojeogo.weather.adapter.out.persistence.mapper;

import com.egojeogo.weather.adapter.out.persistence.entity.RegionEntity;
import org.springframework.stereotype.Component;
import com.egojeogo.weather.domain.model.Region;

@Component
public class RegionJpaMapper {
    public Region toDomain(RegionEntity entity) {
        return new Region(
            entity.getRegionParent(),
            entity.getRegionChild(),
            entity.getNx(),
            entity.getNy()
        );
    }
}
