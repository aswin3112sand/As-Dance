package com.asdance.auth;

import com.asdance.payment.PurchaseRepository;
import com.asdance.security.AccessPolicy;
import com.asdance.user.AppUser;
import com.asdance.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;

@Service
public class AuthService {

  private final UserRepository userRepository;
  private final PasswordService passwordService;
  private final PurchaseRepository purchaseRepository;
  private final AccessPolicy accessPolicy;

  public AuthService(
      UserRepository userRepository,
      PasswordService passwordService,
      PurchaseRepository purchaseRepository,
      AccessPolicy accessPolicy
  ) {
    this.userRepository = userRepository;
    this.passwordService = passwordService;
    this.purchaseRepository = purchaseRepository;
    this.accessPolicy = accessPolicy;
  }

  @Transactional
  public AppUser register(String email, String password, String fullName) {
    String normalizedEmail = accessPolicy.normalizeEmail(email);
    if (!accessPolicy.isAllowedEmail(normalizedEmail)) {
      throw new IllegalArgumentException("EMAIL_NOT_ALLOWED");
    }
    userRepository.findByEmail(normalizedEmail).ifPresent(u -> {
      throw new IllegalArgumentException("EMAIL_ALREADY_REGISTERED");
    });
    var user = AppUser.builder()
        .email(normalizedEmail)
        .passwordHash(passwordService.hash(password))
        .fullName(fullName.trim())
        .externalId(accessPolicy.getAllowedUserId())
        .hasAccess(false)
        .enabled(true)
        .build();
    return userRepository.save(Objects.requireNonNull(user));
  }

  public AppUser authenticate(String email, String password) {
    String normalizedEmail = accessPolicy.normalizeEmail(email);
    if (!accessPolicy.isAllowedEmail(normalizedEmail)) {
      throw new IllegalArgumentException("EMAIL_NOT_ALLOWED");
    }
    var user = userRepository.findByEmail(normalizedEmail)
        .orElseThrow(() -> new IllegalArgumentException("USER_NOT_FOUND"));
    if (!user.isEnabled()) throw new IllegalArgumentException("ACCOUNT_DISABLED");
    if (!passwordService.matches(password, user.getPasswordHash())) {
      throw new IllegalArgumentException("INVALID_PASSWORD");
    }
    if (user.getExternalId() == null || user.getExternalId().isBlank()) {
      user.setExternalId(accessPolicy.getAllowedUserId());
      userRepository.save(user);
    }
    return user;
  }

  public boolean isUnlocked(Long userId) {
    var userOpt = userRepository.findById(userId);
    if (userOpt.isEmpty() || !accessPolicy.isAllowedUser(userOpt.get())) {
      return false;
    }
    boolean purchaseUnlocked = purchaseRepository.findTopByUserIdOrderByCreatedAtDesc(userId)
        .map(p -> isSuccessStatus(p.getStatus()))
        .orElse(false);
    boolean userUnlocked = userOpt.get().isHasAccess();
    return purchaseUnlocked || userUnlocked;
  }

  private boolean isSuccessStatus(String status) {
    if (status == null) return false;
    return "SUCCESS".equalsIgnoreCase(status) || "PAID".equalsIgnoreCase(status);
  }
}
