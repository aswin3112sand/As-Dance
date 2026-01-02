package com.asdance.user;

import com.asdance.payment.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserAccessController {

  private final PaymentService paymentService;

  public UserAccessController(PaymentService paymentService) {
    this.paymentService = paymentService;
  }

  @GetMapping("/access")
  public ResponseEntity<?> access(Authentication auth) {
    boolean unlocked = paymentService.isUnlocked(auth);
    return ResponseEntity.ok(Map.of("unlocked", unlocked));
  }
}
