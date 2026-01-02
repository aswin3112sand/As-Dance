package com.asdance.auth;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class PasswordService {
  private final BCryptPasswordEncoder enc = new BCryptPasswordEncoder();

  public String hash(String raw) {
    return enc.encode(raw);
  }

  public boolean matches(String raw, String hashed) {
    return enc.matches(raw, hashed);
  }
}
