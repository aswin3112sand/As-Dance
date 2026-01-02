package com.asdance.payment;

public class PaymentDtos {

  public record CreateOrderRequest(
    String buyerName,
    String buyerPhone
  ) {}

  public record CreateOrderResponse(
    boolean ok,
    String mode, // MOCK or RAZORPAY
    String keyId,
    String orderId,
    int amountPaise,
    String currency,
    String message
  ) {}

  public record ServiceOrderRequest(
    String difficulty,
    String duration,
    String buyerPhone
  ) {}

  public record ServiceOrderResponse(
    boolean ok,
    String mode,
    String keyId,
    int amountPaise,
    String currency,
    String message,
    String label
  ) {}

  public record VerifyRequest(
    String razorpay_order_id,
    String razorpay_payment_id,
    String razorpay_signature
  ) {}

  public record WebhookRequest(
    String order_id,
    String payment_id
  ) {}

  public record VerifyResponse(boolean ok, boolean unlocked, String message, String unlockedVideoUrl) {}
}
