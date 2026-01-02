package com.asdance.auth;

import com.asdance.user.AppUser;
import com.asdance.user.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;
import java.util.UUID;

@Service
public class GuestUserService {

  private final UserRepository userRepository;
  private final PasswordService passwordService;
  private final String guestEmail;
  private final String guestName;
  private volatile AppUser cachedGuest;

  public GuestUserService(
      UserRepository userRepository,
      PasswordService passwordService,
      @Value("${app.auth.guestEmail:guest@asdance.local}") String guestEmail,
      @Value("${app.auth.guestName:AS DANCE Guest}") String guestName
  ) {
    this.userRepository = userRepository;
    this.passwordService = passwordService;
    this.guestEmail = normalizeEmail(guestEmail, "guest@asdance.local");
    this.guestName = normalizeName(guestName, "AS DANCE Guest");
  }

  @Transactional
  public AppUser getOrCreateGuestUser() {
    AppUser cached = cachedGuest;
    if (cached != null) {
      return cached;
    }
    AppUser user = userRepository.findByEmail(guestEmail)
        .orElseGet(() -> userRepository.save(AppUser.builder()
            .email(guestEmail)
            .passwordHash(passwordService.hash(UUID.randomUUID().toString()))
            .fullName(guestName)
            .enabled(true)
            .build()));
    cachedGuest = user;
    return user;
  }

  private String normalizeEmail(String value, String fallback) {
    String normalized = value == null ? "" : value.trim().toLowerCase(Locale.ROOT);
    return normalized.isBlank() ? fallback : normalized;
  }

  private String normalizeName(String value, String fallback) {
    String normalized = value == null ? "" : value.trim();
    return normalized.isBlank() ? fallback : normalized;
  }
}
