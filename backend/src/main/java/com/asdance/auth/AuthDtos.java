package com.asdance.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class AuthDtos {

  public record RegisterRequest(
    @Email @NotBlank String email,
    @NotBlank String password,
    @NotBlank String fullName
  ) {}

  public record LoginRequest(
    @Email @NotBlank String email,
    @NotBlank String password
  ) {}

  public record MeResponse(
    Long id,
    String email,
    String fullName,
    boolean unlocked
  ) {}

  public record LoginResponse(
    boolean ok,
    String message,
    Long id,
    String email,
    String token
  ) {}

  public record ApiResponse(boolean ok, String message) {}
}
