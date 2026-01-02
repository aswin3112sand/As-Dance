package com.asdance.payment;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import static com.asdance.payment.PaymentDtos.*;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

  private final PaymentService paymentService;

  @Value("${app.bundle.amountPaise:49900}")
  private int bundleAmountPaise;

  @Value("${app.payment.mock:true}")
  private boolean paymentMock;

  @Value("${app.razorpay.keyId:}")
  private String razorpayKeyId;

  public PaymentController(PaymentService paymentService) {
    this.paymentService = paymentService;
  }

  @PostMapping("/order")
  public ResponseEntity<?> createOrder(Authentication auth, @RequestBody(required = false) CreateOrderRequest req) {
    return ResponseEntity.ok(paymentService.createOrder(auth, bundleAmountPaise, req));
  }

  @PostMapping("/verify")
  public ResponseEntity<?> verify(Authentication auth, @Valid @RequestBody VerifyRequest req) {
    return ResponseEntity.ok(paymentService.verify(auth, req));
  }

  @PostMapping("/webhook/razorpay")
  public ResponseEntity<?> webhook(Authentication auth, @RequestBody WebhookRequest req) {
    return ResponseEntity.ok(paymentService.handleWebhook(auth, req));
  }

  @GetMapping("/status")
  public ResponseEntity<?> status(Authentication auth) {
    if (auth == null) {
      return ResponseEntity.ok(new VerifyResponse(true, false, "Locked", ""));
    }
    boolean unlocked = paymentService.isUnlocked(auth);
    String url = unlocked ? paymentService.getUnlockedVideoUrl() : "";
    return ResponseEntity.ok(new VerifyResponse(true, unlocked, unlocked ? "Unlocked" : "Locked", url));
  }

  @PostMapping("/downloaded")
  public ResponseEntity<?> downloaded(Authentication auth) {
    return ResponseEntity.ok(paymentService.markDownloaded(auth));
  }

  @PostMapping("/service-order")
  public ResponseEntity<?> serviceOrder(@RequestBody(required = false) ServiceOrderRequest req) {
    return ResponseEntity.ok(buildServiceOrder(req));
  }

  private ServiceOrderResponse buildServiceOrder(ServiceOrderRequest req) {
    if (req == null) {
      return new ServiceOrderResponse(false, "VALIDATION", "", 0, "INR", "Missing request data.", "");
    }
    String difficulty = normalizeToken(req.difficulty());
    String duration = normalizeDuration(req.duration());
    String buyerPhone = normalizePhone(req.buyerPhone());

    if (difficulty == null || duration == null) {
      return new ServiceOrderResponse(false, "VALIDATION", "", 0, "INR", "Invalid service selection.", "");
    }
    if (buyerPhone == null) {
      return new ServiceOrderResponse(false, "VALIDATION", "", 0, "INR", "Enter a valid WhatsApp phone number.", "");
    }

    int base30;
    int base60;
    switch (difficulty) {
      case "easy" -> {
        base30 = 300;
        base60 = 600;
      }
      case "medium" -> {
        base30 = 400;
        base60 = 800;
      }
      case "hard" -> {
        base30 = 500;
        base60 = 1000;
      }
      default -> {
        return new ServiceOrderResponse(false, "VALIDATION", "", 0, "INR", "Invalid difficulty.", "");
      }
    }

    boolean isSixty = "60s".equals(duration);
    int base = isSixty ? base60 : base30;
    int urgent = isSixty ? 300 : 150;
    int amountPaise = (base + urgent) * 100;
    String keyId = razorpayKeyId == null ? "" : razorpayKeyId;
    String mode = (paymentMock || keyId.isBlank()) ? "MOCK" : "RAZORPAY";
    String durationLabel = isSixty ? "1-Minute Song Choreo" : "30-Second Song Choreo";
    String label = capitalize(difficulty) + " - " + durationLabel;

    return new ServiceOrderResponse(true, mode, keyId, amountPaise, "INR", "Order ready.", label);
  }

  private String normalizeToken(String raw) {
    if (raw == null) return null;
    String token = raw.trim().toLowerCase();
    return token.isBlank() ? null : token;
  }

  private String normalizeDuration(String raw) {
    if (raw == null) return null;
    String token = raw.trim().toLowerCase();
    if (token.contains("30")) return "30s";
    if (token.contains("60") || token.contains("1")) return "60s";
    return null;
  }

  private String normalizePhone(String raw) {
    if (raw == null) return null;
    String digits = raw.replaceAll("[^0-9]", "");
    if (digits.length() < 10) return null;
    return digits;
  }

  private String capitalize(String value) {
    if (value == null || value.isBlank()) return "";
    return value.substring(0, 1).toUpperCase() + value.substring(1);
  }
}
