package com.egojeogo.weather.application.port.out;

import java.util.Optional;
import com.egojeogo.weather.domain.model.Region;

//Port : 서비스에 어떤 데이터가 필요한가 결정 ! 서비스는 entity라는 db관련 몰라야함.
public interface RegionRepository {
    Optional<Region> findByLatitudeAndLongitude(double lat, double lon);

}
