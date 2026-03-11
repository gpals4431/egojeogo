package com.egojeogo.common.exception;

import org.springframework.http.HttpStatus;

/**
 * 공통 에러 코드
 * 각 서비스에서 확장하여 사용
 */
public enum ErrorCode {
    // 공통 에러
    INVALID_INPUT("C001", "잘못된 입력입니다.", HttpStatus.BAD_REQUEST),
    INTERNAL_SERVER_ERROR("C002", "내부 서버 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR),
    UNAUTHORIZED("C003", "인증되지 않은 요청입니다.", HttpStatus.UNAUTHORIZED),
    FORBIDDEN("C004", "권한이 없습니다.", HttpStatus.FORBIDDEN),
    NOT_FOUND("C005", "요청한 리소스를 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
    
    // Weather 서비스 에러
    REGION_NOT_FOUND("W001", "지역 정보를 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
    WEATHER_API_ERROR("W002", "기상청 API 호출에 실패했습니다.", HttpStatus.INTERNAL_SERVER_ERROR),
    
    // Subway 서비스 에러
    STATION_NOT_FOUND("S001", "지하철역을 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
    SUBWAY_API_ERROR("S002", "지하철 API 호출에 실패했습니다.", HttpStatus.INTERNAL_SERVER_ERROR),
    FAVORITE_STATION_NOT_FOUND("S003", "즐겨찾기 역을 찾을 수 없습니다.", HttpStatus.NOT_FOUND);

    private final String code;
    private final String message;
    private final HttpStatus httpStatus;

    ErrorCode(String code, String message, HttpStatus httpStatus) {
        this.code = code;
        this.message = message;
        this.httpStatus = httpStatus;
    }

    public String getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }
}
