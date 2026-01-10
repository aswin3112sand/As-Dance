package com.asdance.auth;

import com.asdance.security.AccessPolicy;
import com.asdance.user.AppUser;
import com.asdance.user.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class AllowedUserSeeder implements ApplicationRunner {

  private final UserRepository userRepository;
  private final PasswordService passwordService;
  private final AccessPolicy accessPolicy;
  private final String allowedPassword;

  public AllowedUserSeeder(
      UserRepository userRepository,
      PasswordService passwordService,
      AccessPolicy accessPolicy,
      @Value("${app.access.allowedPassword:}") String allowedPassword
  ) {
    this.userRepository = userRepository;
    this.passwordService = passwordService;
    this.accessPolicy = accessPolicy;
    this.allowedPassword = allowedPassword == null ? "" : allowedPassword.trim();
  }

  @Override
  @Transactional
  public void run(ApplicationArguments args) {
    String email = accessPolicy.getAllowedEmail();
    if (email == null || email.isBlank()) {
      return;
    }
    if (allowedPassword.isBlank()) {
      return;
    }
    userRepository.findByEmail(email).ifPresentOrElse(user -> {
      boolean updated = false;
      if (user.getExternalId() == null || user.getExternalId().isBlank()) {
        user.setExternalId(accessPolicy.getAllowedUserId());
        updated = true;
      }
      if (!passwordService.matches(allowedPassword, user.getPasswordHash())) {
        user.setPasswordHash(passwordService.hash(allowedPassword));
        updated = true;
      }
      if (!user.isEnabled()) {
        user.setEnabled(true);
        updated = true;
      }
      if (updated) {
        userRepository.save(user);
      }
    }, () -> {
    var user = AppUser.builder()
        .email(email)
        .passwordHash(passwordService.hash(allowedPassword))
        .fullName("AS DANCE User")
        .externalId(accessPolicy.getAllowedUserId())
        .hasAccess(false)
        .enabled(true)
        .build();
      userRepository.save(user);
    });
  }
}
