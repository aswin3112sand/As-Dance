package com.asdance.payment;

import com.asdance.notify.PaymentNotificationService;
import com.asdance.security.AccessPolicy;
import com.asdance.user.AppUser;
import com.asdance.user.UserRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

import static com.asdance.payment.PaymentDtos.*;

@Service
public class PaymentService {

  private final PurchaseRepository purchaseRepository;
  private final UserRepository userRepository;
  private final PaymentNotificationService notificationService;
  private final AccessPolicy accessPolicy;
  private final boolean mock;
  private final String keyId;
  private final String keySecret;
  private final String unlockedVideoUrl;

  public PaymentService(
      PurchaseRepository purchaseRepository,
      UserRepository userRepository,
      PaymentNotificationService notificationService,
      AccessPolicy accessPolicy,
      @Value("${app.payment.mock:true}") boolean mock,
      @Value("${app.razorpay.keyId:}") String keyId,
      @Value("${app.razorpay.keySecret:}") String keySecret,
      @Value("${app.links.unlockedVideo:}") String unlockedVideoUrl
  ) {
    this.purchaseRepository = purchaseRepository;
    this.userRepository = userRepository;
    this.notificationService = notificationService;
    this.accessPolicy = accessPolicy;
    this.mock = mock;
    this.keyId = keyId;
    this.keySecret = keySecret;
    this.unlockedVideoUrl = unlockedVideoUrl;
  }

  @Transactional
  public CreateOrderResponse createOrder(Authentication auth, int amountPaise, CreateOrderRequest req) {
    if (auth == null) {
      return new CreateOrderResponse(false, "AUTH", "", "", amountPaise, "INR", "Please login to continue.");
    }
    Long userId = (Long) auth.getPrincipal();
    AppUser user = userRepository.findById(userId).orElse(null);
    if (user == null) {
      return new CreateOrderResponse(false, "AUTH", "", "", amountPaise, "INR", "User not found.");
    }
    if (!accessPolicy.isAllowedEmail(user.getEmail())) {
      return new CreateOrderResponse(false, "AUTH", "", "", amountPaise, "INR", "Access restricted to allowed email.");
    }
    if (user.getExternalId() == null || user.getExternalId().isBlank()) {
      user.setExternalId(accessPolicy.getAllowedUserId());
      userRepository.save(user);
    }
    if (!accessPolicy.isAllowedUser(user)) {
      return new CreateOrderResponse(false, "AUTH", "", "", amountPaise, "INR", "Access restricted to allowed user.");
    }

    String buyerPhone = normalizePhone(req != null ? req.buyerPhone() : null);
    if (buyerPhone == null) {
      return new CreateOrderResponse(false, "VALIDATION", "", "", amountPaise, "INR", "Enter a valid WhatsApp phone number.");
    }

    var purchase = Purchase.builder()
        .userId(userId)
        .status("CREATED")
        .amountPaise(amountPaise)
        .createdAt(Instant.now())
        .buyerEmail(user.getEmail())
        .buyerName(user.getFullName())
        .buyerPhone(buyerPhone)
        .externalUserId(accessPolicy.getAllowedUserId())
        .build();

    if (mock || keyId == null || keyId.isBlank() || keySecret == null || keySecret.isBlank()) {
      // MOCK order id
      String orderId = "order_mock_" + UUID.randomUUID().toString().replace("-", "");
      purchase.setRazorpayOrderId(orderId);
      purchaseRepository.save(purchase);

      return new CreateOrderResponse(true, "MOCK", "", orderId, amountPaise, "INR",
          "MOCK mode enabled. Click Pay -> we will auto-unlock on verify.");
    }

    try {
      RazorpayClient client = new RazorpayClient(keyId, keySecret);

      JSONObject options = new JSONObject();
      options.put("amount", amountPaise);
      options.put("currency", "INR");
      options.put("receipt", "asdance_rcpt_" + userId + "_" + System.currentTimeMillis());
      options.put("payment_capture", 1);

      Order order = client.orders.create(options);
      String orderId = order.get("id");

      purchase.setRazorpayOrderId(orderId);
      purchaseRepository.save(purchase);

      return new CreateOrderResponse(true, "RAZORPAY", keyId, orderId, amountPaise, "INR", "Order created");
    } catch (Exception e) {
      return new CreateOrderResponse(false, "RAZORPAY", keyId, null, amountPaise, "INR", "Order create failed: " + e.getMessage());
    }
  }

  @Transactional
  public VerifyResponse verify(Authentication auth, VerifyRequest req) {
    if (auth == null) {
      return new VerifyResponse(false, false, "Please login to verify payment.", "");
    }
    Long userId = (Long) auth.getPrincipal();
    AppUser user = userRepository.findById(userId).orElse(null);
    if (user == null || !accessPolicy.isAllowedEmail(user.getEmail())) {
      return new VerifyResponse(false, false, "Access restricted to allowed user.", "");
    }
    if (user.getExternalId() == null || user.getExternalId().isBlank()) {
      user.setExternalId(accessPolicy.getAllowedUserId());
      userRepository.save(user);
    }
    if (!accessPolicy.isAllowedUser(user)) {
      return new VerifyResponse(false, false, "Access restricted to allowed user.", "");
    }

    var purchaseOpt = purchaseRepository.findByRazorpayOrderId(req.razorpay_order_id());
    if (purchaseOpt.isEmpty()) {
      return new VerifyResponse(false, false, "Order not found.", "");
    }
    var purchase = purchaseOpt.get();
    if (!userId.equals(purchase.getUserId())) {
      return new VerifyResponse(false, false, "Order does not match user.", "");
    }
    boolean shouldNotify = purchase.getNotifiedAt() == null;

    // In MOCK mode: accept any verify and unlock
    if (mock || keyId == null || keyId.isBlank() || keySecret == null || keySecret.isBlank()) {
      markSuccess(purchase, req.razorpay_payment_id());
      purchaseRepository.save(purchase);

      if (shouldNotify) {
        notifySuccess(userId, purchase);
      }
      if (user != null && !user.isHasAccess()) {
        user.setHasAccess(true);
        userRepository.save(user);
      }
      return new VerifyResponse(true, true, "Payment Success ✔ Bundle Unlocked!", unlockedVideoUrl);
    }

    // Real mode: verify signature (basic)
    try {
      // Razorpay signature verification:
      // expected = HMAC_SHA256(order_id + "|" + payment_id, keySecret)
      String payload = req.razorpay_order_id() + "|" + req.razorpay_payment_id();
      String expected = HmacUtil.hmacSha256(payload, keySecret);

      if (!expected.equals(req.razorpay_signature())) {
        return new VerifyResponse(false, false, "Signature mismatch", "");
      }

      markSuccess(purchase, req.razorpay_payment_id());
      purchaseRepository.save(purchase);

      if (shouldNotify) {
        notifySuccess(userId, purchase);
      }
      if (user != null && !user.isHasAccess()) {
        user.setHasAccess(true);
        userRepository.save(user);
      }
      return new VerifyResponse(true, true, "Payment Success ✔ Bundle Unlocked!", unlockedVideoUrl);
    } catch (Exception e) {
      return new VerifyResponse(false, false, "Verify failed: " + e.getMessage(), "");
    }
  }

  public boolean isUnlocked(Authentication auth) {
    if (auth == null) return false;
    Long userId = (Long) auth.getPrincipal();
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

  @Transactional
  public VerifyResponse markDownloaded(Authentication auth) {
    Long userId = (Long) auth.getPrincipal();
    AppUser user = userRepository.findById(userId).orElse(null);
    if (!accessPolicy.isAllowedUser(user)) {
      return new VerifyResponse(false, false, "Access restricted to allowed user.", "");
    }
    var purchase = purchaseRepository.findTopByUserIdAndStatusOrderByCreatedAtDesc(userId, "SUCCESS");
    if (purchase.isEmpty()) {
      purchase = purchaseRepository.findTopByUserIdAndStatusOrderByCreatedAtDesc(userId, "PAID");
    }
    if (purchase.isEmpty()) {
      return new VerifyResponse(false, false, "No paid purchase found", "");
    }
    var p = purchase.get();
    if (p.getDownloadedAt() == null) {
      p.setDownloadedAt(Instant.now());
      purchaseRepository.save(p);
    }
    return new VerifyResponse(true, true, "Download recorded", unlockedVideoUrl);
  }

  public String getUnlockedVideoUrl() {
    return unlockedVideoUrl;
  }

  @Transactional
  public VerifyResponse handleWebhook(Authentication auth, WebhookRequest req) {
    if (auth == null) {
      return new VerifyResponse(false, false, "Please login to verify payment.", "");
    }
    if (req == null || req.order_id() == null || req.payment_id() == null) {
      return new VerifyResponse(false, false, "Invalid webhook payload.", "");
    }
    Long userId = (Long) auth.getPrincipal();
    AppUser user = userRepository.findById(userId).orElse(null);
    if (user == null || !accessPolicy.isAllowedEmail(user.getEmail())) {
      return new VerifyResponse(false, false, "Access restricted to allowed user.", "");
    }
    if (user.getExternalId() == null || user.getExternalId().isBlank()) {
      user.setExternalId(accessPolicy.getAllowedUserId());
      userRepository.save(user);
    }
    if (!accessPolicy.isAllowedUser(user)) {
      return new VerifyResponse(false, false, "Access restricted to allowed user.", "");
    }
    var purchaseOpt = purchaseRepository.findByRazorpayOrderId(req.order_id());
    if (purchaseOpt.isEmpty()) {
      return new VerifyResponse(false, false, "Order not found.", "");
    }
    var purchase = purchaseOpt.get();
    if (!userId.equals(purchase.getUserId())) {
      return new VerifyResponse(false, false, "Order does not match user.", "");
    }
    boolean shouldNotify = purchase.getNotifiedAt() == null;

    markSuccess(purchase, req.payment_id());
    purchaseRepository.save(purchase);

    if (user != null) {
      if (user.getExternalId() == null || user.getExternalId().isBlank()) {
        user.setExternalId(accessPolicy.getAllowedUserId());
      }
      if (!user.isHasAccess()) {
        user.setHasAccess(true);
      }
      userRepository.save(user);
    }

    if (shouldNotify) {
      notifySuccess(userId, purchase);
    }
    return new VerifyResponse(true, true, "Payment Success ✔ Bundle Unlocked!", unlockedVideoUrl);
  }

  private void notifySuccess(Long userId, Purchase purchase) {
    if (purchase.getNotifiedAt() != null) {
      return;
    }
    AppUser user = userRepository.findById(userId).orElse(null);
    notificationService.notifyPaymentSuccess(user, purchase, unlockedVideoUrl);
    purchase.setNotifiedAt(Instant.now());
    purchaseRepository.save(purchase);
  }

  private String normalizePhone(String raw) {
    if (raw == null) return null;
    String digits = raw.replaceAll("[^0-9]", "");
    if (digits.length() < 10) return null;
    return digits;
  }

  private void markSuccess(Purchase purchase, String paymentId) {
    purchase.setStatus("SUCCESS");
    purchase.setPaidAt(Instant.now());
    purchase.setRazorpayPaymentId(paymentId);
  }

  private boolean isSuccessStatus(String status) {
    if (status == null) return false;
    return "SUCCESS".equalsIgnoreCase(status) || "PAID".equalsIgnoreCase(status);
  }
}
