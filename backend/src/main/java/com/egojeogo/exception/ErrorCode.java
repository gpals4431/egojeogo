package com.egojeogo.exception;

import org.springframework.http.HttpStatus;

public enum ErrorCode {
    REGION_NOT_FOUND("R001", "지역 정보를 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
    WEATHER_API_ERROR("W001", "기상청 API 호출에 실패했습니다.", HttpStatus.INTERNAL_SERVER_ERROR);

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