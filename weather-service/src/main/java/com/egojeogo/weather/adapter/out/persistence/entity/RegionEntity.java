package com.egojeogo.weather.adapter.out.persistence.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
@Entity
@Table(name = "region")
@Getter
@NoArgsConstructor
public class RegionEntity {
    @Id
    private Long regionCode;//지역코드
    private String regionParent;//시도명
    private String regionChild;//시군구
    private String regionName;//지역명
    private int nx;//x좌표
    private int ny;//y좌표
    private double latitude;//위도
    private double longitude;//경도

}
