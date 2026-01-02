package com.asdance.auth;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import static com.asdance.auth.AuthDtos.ApiResponse;

@RestControllerAdvice(basePackages = "com.asdance.auth")
public class AuthExceptionHandler {

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<ApiResponse> handleIllegalArgument(IllegalArgumentException ex) {
    String message = ex.getMessage() == null ? "Invalid request" : ex.getMessage();
    HttpStatus status = switch (message) {
      case "USER_NOT_FOUND", "INVALID_PASSWORD", "ACCOUNT_DISABLED" -> HttpStatus.UNAUTHORIZED;
      default -> HttpStatus.BAD_REQUEST;
    };
    return ResponseEntity.status(status).body(new ApiResponse(false, message));
  }
}
