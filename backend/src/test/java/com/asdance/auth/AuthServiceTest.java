package com.asdance.auth;

import com.asdance.payment.PurchaseRepository;
import com.asdance.security.AccessPolicy;
import com.asdance.user.AppUser;
import com.asdance.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

  @Mock
  private UserRepository userRepository;

  @Mock
  private PasswordService passwordService;

  @Mock
  private PurchaseRepository purchaseRepository;

  @Mock
  private AccessPolicy accessPolicy;

  @InjectMocks
  private AuthService authService;

  @Test
  void isUnlockedFallsBackToUserAccessWhenPurchaseLookupFails() {
    AppUser user = AppUser.builder()
        .id(1L)
        .email("testuser@asdance.com")
        .fullName("Test User")
        .externalId("U1001")
        .hasAccess(true)
        .enabled(true)
        .build();

    when(userRepository.findById(1L)).thenReturn(Optional.of(user));
    when(accessPolicy.isAllowedUser(user)).thenReturn(true);
    when(purchaseRepository.findTopByUserIdOrderByCreatedAtDesc(1L))
        .thenThrow(new RuntimeException("purchase lookup failed"));

    assertTrue(authService.isUnlocked(1L));
  }
}
