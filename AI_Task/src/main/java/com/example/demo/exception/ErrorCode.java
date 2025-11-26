package com.example.demo.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {

    UNCATEGORIZED_EXCEPTION(9999,"Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1000,"Invalid key", HttpStatus.BAD_REQUEST),
    VALIDATION_FAILED(1001, "Validation failed", HttpStatus.BAD_REQUEST),

    // ======= USER =======
    USER_NOT_FOUND(2001,"User not found", HttpStatus.NOT_FOUND),
    EMAIL_ALREADY_EXISTS(2002,"Email already exists", HttpStatus.BAD_REQUEST),
    USERNAME_EXISTS(2003,"Username already exists", HttpStatus.BAD_REQUEST),
    INVALID_EMAIL(2004,"Invalid email", HttpStatus.BAD_REQUEST),
    USERNAME_REQUIRED(2005,"Username is required", HttpStatus.BAD_REQUEST),
    EMAIL_REQUIRED(2006,"Email is required", HttpStatus.BAD_REQUEST),
    PASSWORD_REQUIRED(2007,"Password is required", HttpStatus.BAD_REQUEST),
    USERNAME_INVALID(2008, "Username must be between {min} and {max} characters", HttpStatus.BAD_REQUEST),
    PASSWORD_INVALID(2009, "Password must be between {min} and {max} characters", HttpStatus.BAD_REQUEST),

    // ======= TASK =======
    TASK_NOT_FOUND(3001,"Task not found", HttpStatus.NOT_FOUND),
    INVALID_TASK_STATUS(3002,"Invalid task status", HttpStatus.BAD_REQUEST),
    CATEGORY_NOT_FOUND(3003,"Category not found", HttpStatus.NOT_FOUND),
    CATEGORY_EXISTS(3004,"Category already exists", HttpStatus.BAD_REQUEST),
    // ======= NOTIFICATION =======
    NOTIFICATION_NOT_FOUND(4001,"Notification not found", HttpStatus.NOT_FOUND),
    INVALID_NOTIFICATION_TYPE(4002,"Invalid notification type", HttpStatus.BAD_REQUEST),

    // ======= AI ANALYSIS =======
    AI_ANALYSIS_NOT_FOUND(5001,"AI analysis not found", HttpStatus.NOT_FOUND),
    INVALID_AI_REQUEST(5002,"Invalid AI analysis request", HttpStatus.BAD_REQUEST),
    AI_SERVICE_FAILED(5003, "AI service failed", HttpStatus.INTERNAL_SERVER_ERROR),
    // ======= AUTH =======
    UNAUTHENTICATED(6001,"Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(6002,"Unauthorized", HttpStatus.FORBIDDEN);

    private final int code;
    private final String message;
    private final HttpStatus httpStatus;

    ErrorCode(int code, String message, HttpStatus httpStatus) {
        this.code = code;
        this.message = message;
        this.httpStatus = httpStatus;
    }
}
