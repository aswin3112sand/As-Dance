package com.asdance.admin;

import java.time.Instant;

public class AdminDtos {
  public record AdminLoginRequest(String email, String password) {}

  public record ApiResponse(boolean ok, String message) {}

  public record PurchaseRow(
      Long purchaseId,
      Long userId,
      String fullName,
      String email,
      String status,
      Integer amountPaise,
      String razorpayOrderId,
      String razorpayPaymentId,
      Instant createdAt,
      Instant paidAt,
      Instant downloadedAt
  ) {}
}
