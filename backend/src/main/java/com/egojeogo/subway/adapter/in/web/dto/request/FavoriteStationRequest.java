package com.egojeogo.subway.adapter.in.web.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class FavoriteStationRequest {
    private String stationName;   // 검색한 역 이름
    private String upLine;        // 호선
    
}

