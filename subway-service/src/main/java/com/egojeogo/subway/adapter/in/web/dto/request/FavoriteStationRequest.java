package com.egojeogo.subway.adapter.in.web.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class FavoriteStationRequest {
    // @NotBlank(message = "역 이름은 필수입니다")
    private String stationName;   // 검색한 역 이름
    
    // @NotBlank(message = "방향(상행/하행)은 필수입니다")
    private String upDownLine;    // 상행/하행
    
    // @NotBlank(message = "호선은 필수입니다")
    private String line;        // 호선
}

