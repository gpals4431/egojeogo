package com.egojeogo.subway.enums;

public enum SubwayEnum {
    SUBWAY_REAL_TIME_ARRIVAL("realtimeStationArrival");

    private String value;

    SubwayEnum(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
