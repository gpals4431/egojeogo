package com.egojeogo.subway.application.port.out;

import com.egojeogo.subway.domain.model.SubwayArrival;
import com.egojeogo.subway.domain.model.FavoriteStation;
import java.util.List;

//외부 api 계약이기 때문에 application.port.out 에 작성
public interface SubwayArrivalPort {
    List<SubwayArrival> getSubwayRealTimeArrival(FavoriteStation favoriteStation);
}
