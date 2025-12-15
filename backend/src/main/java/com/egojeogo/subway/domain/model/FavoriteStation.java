package com.egojeogo.subway.domain.model;
import java.time.LocalDateTime;
import lombok.Getter;
// 도메인 : 비즈니스 개념 그 자체 
// 들어가면 안되는 것 : dto, controller, service, repository
@Getter
public class FavoriteStation {
    private String userId;
    private String stationName;
    private String line;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public FavoriteStation(String userId, String stationName, String line, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.userId = userId;
        this.stationName = stationName;
        this.line = line;
        if (createdAt == null) {
            this.createdAt = LocalDateTime.now();
        } else {
            this.createdAt = createdAt;
        }
        if (updatedAt == null && createdAt != null) {
            this.updatedAt = LocalDateTime.now();
        } else {
            this.updatedAt = updatedAt;
        }
        this.updatedAt = LocalDateTime.now();
    }
}
