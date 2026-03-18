package com.asdance.auth;

import com.asdance.payment.PurchaseRepository;
import com.asdance.security.AccessPolicy;
import com.asdance.user.AppUser;
import com.asdance.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;

@Service
public class AuthService {

  private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

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
    String safeFullName = resolveFullName(fullName, normalizedEmail);
    var user = AppUser.builder()
        .email(normalizedEmail)
        .passwordHash(passwordService.hash(password))
        .fullName(safeFullName)
        .externalId(accessPolicy.getAllowedUserId())
        .hasAccess(false)
        .enabled(true)
        .build();
    return userRepository.save(user);
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
    boolean needsSave = false;
    if (user.getExternalId() == null || user.getExternalId().isBlank()) {
      user.setExternalId(accessPolicy.getAllowedUserId());
      needsSave = true;
    }
    String safeFullName = resolveFullName(user.getFullName(), normalizedEmail);
    if (!Objects.equals(safeFullName, user.getFullName())) {
      user.setFullName(safeFullName);
      needsSave = true;
    }
    if (needsSave) {
      userRepository.save(user);
    }
    return user;
  }

  public AppUser findAllowedUser(Long userId, String email) {
    AppUser user = userRepository.findById(userId)
        .orElseThrow(() -> new IllegalArgumentException("USER_NOT_FOUND"));
    if (!Objects.equals(accessPolicy.normalizeEmail(email), accessPolicy.normalizeEmail(user.getEmail()))) {
      throw new IllegalArgumentException("EMAIL_NOT_ALLOWED");
    }
    if (!accessPolicy.isAllowedUser(user)) {
      throw new IllegalArgumentException("EMAIL_NOT_ALLOWED");
    }
    return user;
  }

  public boolean isUnlocked(Long userId) {
    var userOpt = userRepository.findById(userId);
    if (userOpt.isEmpty() || !accessPolicy.isAllowedUser(userOpt.get())) {
      return false;
    }
    boolean userUnlocked = userOpt.get().isHasAccess();
    try {
      boolean purchaseUnlocked = purchaseRepository.findTopByUserIdOrderByCreatedAtDesc(userId)
          .map(p -> isSuccessStatus(p.getStatus()))
          .orElse(false);
      return purchaseUnlocked || userUnlocked;
    } catch (RuntimeException ex) {
      logger.warn("Unable to resolve purchase unlock state for user {}", userId, ex);
      return userUnlocked;
    }
  }

  private boolean isSuccessStatus(String status) {
    if (status == null) return false;
    return "SUCCESS".equalsIgnoreCase(status) || "PAID".equalsIgnoreCase(status);
  }

  private String resolveFullName(String fullName, String email) {
    String normalizedName = fullName == null ? "" : fullName.trim();
    if (!normalizedName.isBlank()) {
      return normalizedName;
    }
    int emailSeparator = email.indexOf('@');
    if (emailSeparator > 0) {
      return email.substring(0, emailSeparator);
    }
    return "AS DANCE User";
  }
}
