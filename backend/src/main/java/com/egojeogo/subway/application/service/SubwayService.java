package com.egojeogo.subway.application.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.Arrays;
import java.util.List;
import java.util.ArrayList;
import com.egojeogo.subway.application.port.in.FavoriteStationUseCase;
import com.egojeogo.subway.domain.model.FavoriteStation;
import com.egojeogo.subway.domain.model.SubwayArrival;
import com.egojeogo.subway.adapter.in.web.dto.response.SubwayArrivalResponse;
import com.egojeogo.subway.application.port.out.FavoriteStationRepository;
import com.egojeogo.subway.application.port.out.SubwayArrivalPort;

@Service
@RequiredArgsConstructor
@Slf4j
/* application 계층은 비즈니스 로직을 구현하는 계층으로 Port만 의존하며 기술 세부사항은 모름  */
public class SubwayService implements FavoriteStationUseCase{
    private final FavoriteStationRepository repository;
    private final SubwayArrivalPort subwayArrivalPort;
    @Override
    public void registerFavoriteStation(FavoriteStation favoriteStation) {
        log.info("관심역 등록: {}", favoriteStation);

        repository.save(favoriteStation);
    }
    @Override
    public void updateFavoriteStation(FavoriteStation favoriteStation) {

        log.info("update favorite station:{}", favoriteStation.toString());
        repository.update(favoriteStation);
    }
    @Override
    public List<SubwayArrivalResponse> getFavoriteStation() {
        
        // DB에서 관심역 정보 가져오기. 
        List<FavoriteStation> favoriteStations = repository.findAll();
        log.info("get favorite station:{}", favoriteStations.toString());

        // 관심역에 대한 실시간 지하철 정보 api 가져오기 
        try {
            List<SubwayArrivalResponse> subwayArrivalResponses = new ArrayList<>();
            for (FavoriteStation favoriteStation : favoriteStations) {
                List<SubwayArrival> subwayRealTimeArrival = subwayArrivalPort.getSubwayRealTimeArrival(favoriteStation);
                log.info("get subway real time arrival:{}", Arrays.toString(subwayRealTimeArrival.toArray()));
                subwayArrivalResponses.addAll(subwayRealTimeArrival.stream()
                    .map(SubwayArrivalResponse::from)
                    .toList());
                }
            return subwayArrivalResponses;
                
        } catch (Exception e) {
            log.error("get subway real time arrival failed:{}", e);
            return new ArrayList<>();
        }
    }
}
