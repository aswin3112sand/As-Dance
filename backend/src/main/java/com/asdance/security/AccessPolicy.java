package com.asdance.security;

import com.asdance.user.AppUser;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Locale;

@Component
public class AccessPolicy {

  private final String allowedEmail;
  private final String allowedUserId;

  public AccessPolicy(
      @Value("${app.access.allowedEmail:<EMAIL_ID>}") String allowedEmail,
      @Value("${app.access.allowedUserId:U1001}") String allowedUserId
  ) {
    this.allowedEmail = normalizeEmail(allowedEmail);
    this.allowedUserId = normalizeToken(allowedUserId);
  }

  public boolean isAllowedEmail(String email) {
    String normalized = normalizeEmail(email);
    if (normalized.isBlank()) {
      return false;
    }
    if (allowedEmail.isBlank() || "<email_id>".equals(allowedEmail)) {
      return true;
    }
    return normalized.equals(allowedEmail);
  }

  public boolean isAllowedUser(AppUser user) {
    if (user == null) return false;
    if (!isAllowedEmail(user.getEmail())) return false;
    if (allowedUserId.isBlank()) return true;
    String userExternalId = normalizeToken(user.getExternalId());
    return !userExternalId.isBlank() && userExternalId.equals(allowedUserId);
  }

  public String getAllowedUserId() {
    return allowedUserId;
  }

  public String getAllowedEmail() {
    return allowedEmail;
  }

  public String normalizeEmail(String email) {
    if (email == null) return "";
    return email.trim().toLowerCase(Locale.ROOT);
  }

  public String normalizeToken(String value) {
    if (value == null) return "";
    return value.trim();
  }
}
