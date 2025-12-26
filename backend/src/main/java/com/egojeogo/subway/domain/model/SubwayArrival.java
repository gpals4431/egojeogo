package com.egojeogo.subway.domain.model;

import com.egojeogo.subway.enums.SubwayLine;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;
//domain: 비즈니스 규칙에 해당하므로 기술 식별자는 필요없음. 
@Getter
@ToString
@AllArgsConstructor
public class SubwayArrival {
    private SubwayLine line;      // 호선 ID (1001=1호선, 1002=2호선 등)
    private String updnLine;      // 상행/하행
    private String trainLineNm;   // 열차 노선명 (종착역행 - 방면)
    private String statnNm;       // 현재 역명
    private String bstatnNm;      // 종착역명
    private String arvlMsg2;      // 첫번째도착메세지(도착, 출발 , 진입 등)
    private String arvlMsg3;      // 두번째도착메세지(종합운동장 도착, 12분 후 등)
    private String btrainSttus;   // 열차 상태 (일반/급행)
    private String btrainNo;      // 열차 번호
    
    
    public String getLineName() {
        return line.getName();
    }
}
