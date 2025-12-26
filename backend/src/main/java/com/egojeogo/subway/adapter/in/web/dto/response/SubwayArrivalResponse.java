package com.egojeogo.subway.adapter.in.web.dto.response;

import lombok.Builder;
import lombok.Data;
import com.egojeogo.subway.domain.model.SubwayArrival;

@Data
@Builder
public class SubwayArrivalResponse {
    private String lineName;    // 호선 이름
    private String updnLine;      // 상행/하행
    private String trainLineNm;   // 열차 노선명 (종착역행 - 방면)
    private String statnNm;       // 현재 역명
    private String bstatnNm;      // 종착역명
    private String arvlMsg2;      // 첫번째도착메세지(도착, 출발 , 진입 등)
    private String arvlMsg3;      // 두번째도착메세지(종합운동장 도착, 12분 후 등)
    private String btrainSttus;   // 열차 상태 (일반/급행)
    private String btrainNo;      // 열차 번호
    
    public static SubwayArrivalResponse from(SubwayArrival domain){
        return new SubwayArrivalResponse(
            domain.getLineName(),
            domain.getUpdnLine(),
            domain.getTrainLineNm(),
            domain.getStatnNm(),
            domain.getBstatnNm(),
            domain.getArvlMsg2(),
            domain.getArvlMsg3(),
            domain.getBtrainSttus(),
            domain.getBtrainNo()
        );
    }

    
}

