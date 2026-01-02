package com.asdance.security;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Optional;

@Component
public class CookieService {
  public static final String TOKEN_COOKIE = "asdance_token";
  public static final String ADMIN_COOKIE = "asdance_admin";

  public Optional<String> readToken(HttpServletRequest request) {
    Cookie[] cookies = request.getCookies();
    if (cookies == null) return Optional.empty();
    return Arrays.stream(cookies)
        .filter(c -> TOKEN_COOKIE.equals(c.getName()))
        .map(Cookie::getValue)
        .findFirst();
  }

  public Optional<String> readAdminToken(HttpServletRequest request) {
    Cookie[] cookies = request.getCookies();
    if (cookies == null) return Optional.empty();
    return Arrays.stream(cookies)
        .filter(c -> ADMIN_COOKIE.equals(c.getName()))
        .map(Cookie::getValue)
        .findFirst();
  }
}
