package com.egojeogo.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import com.egojeogo.exception.ErrorResponse;

@RestControllerAdvice // 모든 컨트롤러에서 발생하는 예외를 여기서 다 잡습니다.
public class GlobalExceptionHandler {

    // 우리가 만든 CustomException을 처리하는 메서드
    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ErrorResponse> handleCustomException(CustomException ex) {
        ErrorCode errorCode = ex.getErrorCode();
        
        // 1. ErrorResponse 객체 생성
        ErrorResponse response = ErrorResponse.of(errorCode);

        // 2. Enum에 정의된 HttpStatus와 함께 반환 (예: 404, 500 등)
        return new ResponseEntity<>(response, errorCode.getHttpStatus());
    }

}