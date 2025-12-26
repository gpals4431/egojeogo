package com.egojeogo.subway.adapter.out.persistence.entity;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import java.time.LocalDateTime;
import com.egojeogo.subway.domain.model.FavoriteStation;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
// domain과 중복되는 코드여도 반드시 entity와 구분하여 작성한다.
// domain은 비즈니스 정책관련으로 거의 안바뀜.
// - jpa 의존 x 
// - db 기술에 의존 x 
// entity는 데이터베이스 관련으로 자주 바뀜.
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "favorite_station")
public class FavoriteStationEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String userId;
    private String stationName;
    private String upDownLine;
    private String line;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static FavoriteStationEntity from(FavoriteStation domain) {
        FavoriteStationEntity e = new FavoriteStationEntity();
        e.userId = "me"; // 임시 사용자 아이디
        e.stationName = domain.getStationName();
        e.upDownLine = domain.getUpDownLine();
        e.line = domain.getLine();
        return e;
    }

    public FavoriteStation toDomain() {
        return new FavoriteStation(this.userId, this.stationName, this.upDownLine, this.line);
    }

    @PrePersist
    void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    @PreUpdate
    void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
