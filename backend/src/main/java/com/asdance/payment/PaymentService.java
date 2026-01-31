package com.asdance.payment;

import com.asdance.notify.PaymentNotificationService;
import com.asdance.security.AccessPolicy;
import com.asdance.user.AppUser;
import com.asdance.user.UserRepository;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

import static com.asdance.payment.PaymentDtos.*;

@Service
public class PaymentService {
  private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);

  private final PurchaseRepository purchaseRepository;
  private final OrderRepository orderRepository;
  private final PaymentRepository paymentRepository;
  private final UserRepository userRepository;
  private final PaymentNotificationService notificationService;
  private final AccessPolicy accessPolicy;
  private final boolean mock;
  private final String keyId;
  private final String keySecret;
  private final int coursePricePaise;
  private final String unlockedVideoUrl;
  private final String googleDriveFolder;

  private static final String ORDER_STATUS_CREATED = "created";
  private static final String ORDER_STATUS_PAID = "paid";

  public PaymentService(
      PurchaseRepository purchaseRepository,
      OrderRepository orderRepository,
      PaymentRepository paymentRepository,
      UserRepository userRepository,
      PaymentNotificationService notificationService,
      AccessPolicy accessPolicy,
      @Value("${app.payment.mock:true}") boolean mock,
      @Value("${app.razorpay.keyId:}") String keyId,
      @Value("${app.razorpay.keySecret:}") String keySecret,
      @Value("${app.course.pricePaise:50000}") int coursePricePaise,
      @Value("${app.links.unlockedVideo:}") String unlockedVideoUrl,
      @Value("${app.links.googleDriveFolder:}") String googleDriveFolder
  ) {
    this.purchaseRepository = purchaseRepository;
    this.orderRepository = orderRepository;
    this.paymentRepository = paymentRepository;
    this.userRepository = userRepository;
    this.notificationService = notificationService;
    this.accessPolicy = accessPolicy;
    this.mock = mock;
    this.keyId = resolveKeyId(keyId);
    this.keySecret = resolveKeySecret(keySecret);
    this.coursePricePaise = coursePricePaise;
    this.unlockedVideoUrl = unlockedVideoUrl;
    this.googleDriveFolder = googleDriveFolder;
    
    logRazorpayConfig();
  }
  
  private String resolveKeyId(String configValue) {
    if (configValue != null && !configValue.isBlank()) {
      return configValue;
    }
    String envValue = System.getenv("RAZORPAY_KEY_ID");
    return envValue != null ? envValue : "";
  }
  
  private String resolveKeySecret(String configValue) {
    if (configValue != null && !configValue.isBlank()) {
      return configValue;
    }
    String envValue = System.getenv("RAZORPAY_KEY_SECRET");
    return envValue != null ? envValue : "";
  }
  
  private void logRazorpayConfig() {
    boolean hasKeys = keyId != null && !keyId.isBlank() && keySecret != null && !keySecret.isBlank();
    if (mock) {
      logger.info("[RAZORPAY] MOCK MODE ENABLED - Real payments disabled");
    } else if (hasKeys) {
      logger.info("[RAZORPAY] Keys loaded successfully. KeyId: {}...", keyId.substring(0, Math.min(8, keyId.length())));
    } else {
      logger.warn("[RAZORPAY] KEYS NOT FOUND - Payment will fail. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables");
    }
  }

  @Transactional
  public CreateCourseOrderResponse createCourseOrder(Authentication auth, CreateCourseOrderRequest req) {
    if (auth == null) {
      return new CreateCourseOrderResponse(false, "UNAUTHORIZED", null, 0, null);
    }
    if (req == null || req.courseId() == null || req.courseId() <= 0) {
      return new CreateCourseOrderResponse(false, "INVALID_COURSE", null, 0, null);
    }
    if (keyId == null || keyId.isBlank() || keySecret == null || keySecret.isBlank()) {
      return new CreateCourseOrderResponse(false, "PAYMENT_CONFIG_MISSING", null, 0, null);
    }

    int amountPaise = resolveCourseAmount(req.courseId());
    if (amountPaise <= 0) {
      return new CreateCourseOrderResponse(false, "INVALID_AMOUNT", null, 0, null);
    }

    Long userId = (Long) auth.getPrincipal();
    AppUser user = userRepository.findById(userId).orElse(null);
    if (user == null) {
      return new CreateCourseOrderResponse(false, "USER_NOT_FOUND", null, 0, null);
    }

    try {
      RazorpayClient client = new RazorpayClient(keyId, keySecret);
      JSONObject options = new JSONObject();
      options.put("amount", amountPaise);
      options.put("currency", "INR");
      options.put("receipt", "course_" + req.courseId() + "_" + userId + "_" + System.currentTimeMillis());
      options.put("payment_capture", 1);

      com.razorpay.Order rzpOrder = client.orders.create(options);
      String orderId = rzpOrder.get("id");

      Order order = Order.builder()
          .userId(userId)
          .courseId(req.courseId())
          .amount(amountPaise)
          .orderId(orderId)
          .status(ORDER_STATUS_CREATED)
          .build();
      orderRepository.save(order);

      return new CreateCourseOrderResponse(true, "ORDER_CREATED", orderId, amountPaise, keyId);
    } catch (Exception e) {
      return new CreateCourseOrderResponse(false, "ORDER_CREATE_FAILED", null, 0, null);
    }
  }

  @Transactional
  public VerifyCourseResponse verifyCoursePayment(Authentication auth, VerifyRequest req) {
    if (auth == null) {
      return new VerifyCourseResponse(false, false, "UNAUTHORIZED");
    }
    if (req == null || req.razorpay_order_id() == null || req.razorpay_payment_id() == null || req.razorpay_signature() == null) {
      return new VerifyCourseResponse(false, false, "INVALID_PAYLOAD");
    }
    if (keySecret == null || keySecret.isBlank()) {
      return new VerifyCourseResponse(false, false, "PAYMENT_CONFIG_MISSING");
    }

    Long userId = (Long) auth.getPrincipal();
    AppUser user = userRepository.findById(userId).orElse(null);
    if (user == null) {
      return new VerifyCourseResponse(false, false, "USER_NOT_FOUND");
    }

    var orderOpt = orderRepository.findByOrderId(req.razorpay_order_id());
    if (orderOpt.isEmpty()) {
      return new VerifyCourseResponse(false, false, "ORDER_NOT_FOUND");
    }
    Order order = orderOpt.get();
    if (!userId.equals(order.getUserId())) {
      return new VerifyCourseResponse(false, false, "ORDER_USER_MISMATCH");
    }
    if (ORDER_STATUS_PAID.equalsIgnoreCase(order.getStatus())) {
      return new VerifyCourseResponse(false, false, "ORDER_ALREADY_PAID");
    }
    if (paymentRepository.existsByPaymentId(req.razorpay_payment_id())) {
      return new VerifyCourseResponse(false, false, "PAYMENT_ALREADY_USED");
    }
    int expectedAmount = resolveCourseAmount(order.getCourseId());
    if (expectedAmount <= 0 || order.getAmount() == null || order.getAmount() != expectedAmount) {
      return new VerifyCourseResponse(false, false, "AMOUNT_MISMATCH");
    }

    try {
      JSONObject payload = new JSONObject();
      payload.put("razorpay_order_id", req.razorpay_order_id());
      payload.put("razorpay_payment_id", req.razorpay_payment_id());
      payload.put("razorpay_signature", req.razorpay_signature());
      Utils.verifyPaymentSignature(payload, keySecret);
    } catch (Exception e) {
      return new VerifyCourseResponse(false, false, "SIGNATURE_MISMATCH");
    }

    order.setStatus(ORDER_STATUS_PAID);
    order.setPaymentId(req.razorpay_payment_id());
    orderRepository.save(order);

    Payment payment = Payment.builder()
        .orderId(req.razorpay_order_id())
        .paymentId(req.razorpay_payment_id())
        .signature(req.razorpay_signature())
        .build();
    paymentRepository.save(payment);

    if (!user.isHasAccess()) {
      user.setHasAccess(true);
      userRepository.save(user);
    }

    return new VerifyCourseResponse(true, true, "PAYMENT_SUCCESS");
  }

  @Transactional
  public CreateOrderResponse createOrder(Authentication auth, int amountPaise, CreateOrderRequest req) {
    try {
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

      String buyerName = normalizeName(req != null ? req.buyerName() : null);
      String buyerPhone = normalizePhone(req != null ? req.buyerPhone() : null);
      if (buyerName.isBlank()) {
        buyerName = user.getFullName();
      }

      var purchase = Purchase.builder()
          .userId(userId)
          .status("CREATED")
          .amountPaise(amountPaise)
          .createdAt(Instant.now())
          .buyerEmail(user.getEmail())
          .buyerName(buyerName)
          .buyerPhone(buyerPhone.isBlank() ? null : buyerPhone)
          .externalUserId(accessPolicy.getAllowedUserId())
          .build();

      if (mock || keyId == null || keyId.isBlank() || keySecret == null || keySecret.isBlank()) {
        String orderId = "order_mock_" + UUID.randomUUID().toString().replace("-", "");
        purchase.setRazorpayOrderId(orderId);
        purchaseRepository.save(purchase);
        return new CreateOrderResponse(true, "MOCK", "", orderId, amountPaise, "INR",
            "MOCK mode enabled. Click Pay -> we will auto-unlock on verify.");
      }

      RazorpayClient client = new RazorpayClient(keyId, keySecret);
      JSONObject options = new JSONObject();
      options.put("amount", amountPaise);
      options.put("currency", "INR");
      options.put("receipt", "asdance_rcpt_" + userId + "_" + System.currentTimeMillis());
      options.put("payment_capture", 1);

      com.razorpay.Order order = client.orders.create(options);
      String orderId = order.get("id");
      purchase.setRazorpayOrderId(orderId);
      purchaseRepository.save(purchase);

      return new CreateOrderResponse(true, "RAZORPAY", keyId, orderId, amountPaise, "INR", "Order created");
    } catch (Exception e) {
      return new CreateOrderResponse(false, "ERROR", keyId, null, amountPaise, "INR", "Order create failed: " + e.getMessage());
    }
  }

  @Transactional
  public VerifyResponse verify(Authentication auth, VerifyRequest req) {
    try {
      if (auth == null) {
        return new VerifyResponse(false, false, "Please login to verify payment.", "");
      }
      if (req == null || req.razorpay_order_id() == null || req.razorpay_payment_id() == null) {
        return new VerifyResponse(false, false, "Invalid payment payload.", "");
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

      if (mock || keyId == null || keyId.isBlank() || keySecret == null || keySecret.isBlank()) {
        markSuccess(purchase, req.razorpay_payment_id());
        purchaseRepository.save(purchase);
        if (shouldNotify) notifySuccess(userId, purchase);
        if (user != null && !user.isHasAccess()) {
          user.setHasAccess(true);
          userRepository.save(user);
        }
        return new VerifyResponse(true, true, "Payment Success ✔ Bundle Unlocked!", googleDriveFolder);
      }

      String payload = req.razorpay_order_id() + "|" + req.razorpay_payment_id();
      String expected = HmacUtil.hmacSha256(payload, keySecret);
      if (!expected.equals(req.razorpay_signature())) {
        return new VerifyResponse(false, false, "Signature mismatch", "");
      }

      markSuccess(purchase, req.razorpay_payment_id());
      purchaseRepository.save(purchase);
      if (shouldNotify) notifySuccess(userId, purchase);
      if (user != null && !user.isHasAccess()) {
        user.setHasAccess(true);
        userRepository.save(user);
      }
      return new VerifyResponse(true, true, "Payment Success ✔ Bundle Unlocked!", googleDriveFolder);
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
    boolean orderUnlocked = orderRepository.existsByUserIdAndStatusIgnoreCase(userId, ORDER_STATUS_PAID);
    boolean userUnlocked = userOpt.get().isHasAccess();
    return purchaseUnlocked || orderUnlocked || userUnlocked;
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
    return new VerifyResponse(true, true, "Download recorded", resolveUnlockedUrl());
  }

  public String getUnlockedVideoUrl() {
    return resolveUnlockedUrl();
  }

  @Transactional
  public VerifyResponse handleWebhook(Authentication auth, WebhookRequest req) {
    try {
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

      boolean isMockMode = mock || keyId == null || keyId.isBlank() || keySecret == null || keySecret.isBlank();
      if (!isMockMode) {
        String signature = req.razorpay_signature();
        if (signature == null || signature.isBlank()) {
          return new VerifyResponse(false, false, "Signature required", "");
        }
        String payload = req.order_id() + "|" + req.payment_id();
        String expected = HmacUtil.hmacSha256(payload, keySecret);
        if (!expected.equals(signature)) {
          return new VerifyResponse(false, false, "Signature mismatch", "");
        }
      }

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
      return new VerifyResponse(true, true, "Payment Success ✔ Bundle Unlocked!", googleDriveFolder);
    } catch (Exception e) {
      return new VerifyResponse(false, false, "Webhook error: " + e.getMessage(), "");
    }
  }

  private void notifySuccess(Long userId, Purchase purchase) {
    if (purchase.getNotifiedAt() != null) {
      return;
    }
    AppUser user = userRepository.findById(userId).orElse(null);
    notificationService.notifyPaymentSuccess(user, purchase, resolveUnlockedUrl());
    purchase.setNotifiedAt(Instant.now());
    purchaseRepository.save(purchase);
  }

  private String resolveUnlockedUrl() {
    if (unlockedVideoUrl != null && !unlockedVideoUrl.isBlank()) {
      return unlockedVideoUrl;
    }
    return googleDriveFolder == null ? "" : googleDriveFolder;
  }

  private String normalizePhone(String raw) {
    if (raw == null) return "";
    String digits = raw.replaceAll("\\D", "");
    if (digits.isBlank()) return "";
    return digits.length() < 10 ? "" : digits;
  }

  private String normalizeName(String raw) {
    if (raw == null) return "";
    return raw.trim();
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

  private int resolveCourseAmount(Long courseId) {
    if (courseId == null || courseId <= 0) {
      return -1;
    }
    return coursePricePaise;
  }
}
