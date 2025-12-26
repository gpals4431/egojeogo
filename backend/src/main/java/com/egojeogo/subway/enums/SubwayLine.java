package com.egojeogo.subway.enums;

import java.util.Arrays;

public enum SubwayLine {
    LINE_1("1001", "1호선"),
    LINE_2("1002", "2호선"),
    LINE_3("1003", "3호선"),
    LINE_4("1004", "4호선"),
    LINE_5("1005", "5호선"),
    LINE_6("1006", "6호선"),
    LINE_7("1007", "7호선"),
    LINE_8("1008", "8호선"),
    LINE_9("1009", "9호선"),
    GYEONGUI("1063", "경의중앙선"),
    AIRPORT("1065", "공항철도"),
    GYEONGCHUN("1067", "경춘선"),
    SUIN_BUNDANG("1075", "수인분당선"),
    SINBUNDANG("1077", "신분당선"),
    UI_SINSEOL("1091", "우이신설선"),
    SEOHAE("1092", "서해선"),
    GIMPO_GOLD("1093", "김포골드라인"),
    SILLIM("1094", "신림선");

    private final String id;
    private final String name;

    SubwayLine(String id, String name) {
        this.id = id;
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public static SubwayLine fromId(String id) {
        return Arrays.stream(values())
            .filter(v -> v.id.equals(id))
            .findFirst()
            .orElseThrow(() -> 
                new IllegalArgumentException("알 수 없는 호선 ID: " + id)
            );
    }
}
