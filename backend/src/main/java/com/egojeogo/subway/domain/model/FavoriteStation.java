package com.egojeogo.subway.domain.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;
// 도메인 : 비즈니스 개념, 상태 값 보유, 규칙검사
// 들어가면 안되는 것 : dto, controller, service, repository, 현재 시간 생성, db 저장용 필드(create_at 등)
@Getter
@ToString
@AllArgsConstructor
public class FavoriteStation {
    private String userId;
    private String stationName;
    private String upDownLine; // (상행/내선, 하행/외선)
    private String line;
}
