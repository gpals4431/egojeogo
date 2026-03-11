package com.egojeogo.weather.domain.model;

import com.egojeogo.weather.adapter.out.persistence.entity.RegionEntity;
import lombok.Getter;
import lombok.AllArgsConstructor;

@Getter
@AllArgsConstructor
public class Region {
    private final String regionParent;
    private final String regionChild;
    private final int nx;
    private final int ny;

    public static Region from(RegionEntity entity) {
        return new Region(
            entity.getRegionParent(),
            entity.getRegionChild(),
            entity.getNx(),
            entity.getNy()
        );
    }
}
