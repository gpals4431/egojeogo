package com.egojeogo.common.exception;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * 공통 에러 응답 DTO
 */
@Getter
@Builder
public class ErrorResponse {
    private final String code;
    private final String message;
    @Builder.Default
    private final LocalDateTime timestamp = LocalDateTime.now();

    public static ErrorResponse of(ErrorCode errorCode) {
        return ErrorResponse.builder()
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .build();
    }

    public static ErrorResponse of(ErrorCode errorCode, String customMessage) {
        return ErrorResponse.builder()
                .code(errorCode.getCode())
                .message(customMessage)
                .build();
    }
}
