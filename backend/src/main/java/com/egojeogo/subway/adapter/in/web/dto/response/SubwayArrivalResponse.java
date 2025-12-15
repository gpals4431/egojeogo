package com.egojeogo.subway.adapter.in.web.dto.response;

import lombok.Builder;
import lombok.Data;
import com.egojeogo.subway.domain.model.SubwayArrival;

@Data
@Builder
public class SubwayArrivalResponse {
    private String stationName;   // 검색한 역 이름
    private String upLine;        // 상행 열차 목록
    private String downLine;   
    
    public static SubwayArrivalResponse from(SubwayArrival domain){
        return new SubwayArrivalResponse(
            domain.getStatnNm(), 
            domain.getUpdnLine(), 
            domain.getTrainLineNm()
        );
    }
}

