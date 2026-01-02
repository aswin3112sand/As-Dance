package com.asdance.notify;

import com.asdance.payment.Purchase;
import com.asdance.user.AppUser;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class PaymentNotificationService {
  private final EmailService emailService;
  private final WhatsAppService whatsAppService;
  private final String adminWhatsapp;
  private final String supportWhatsapp;
  private final String brandName;

  public PaymentNotificationService(
      EmailService emailService,
      WhatsAppService whatsAppService,
      @Value("${app.notify.adminWhatsapp:}") String adminWhatsapp,
      @Value("${app.support.whatsapp:}") String supportWhatsapp,
      @Value("${app.brand.name:AS DANCE}") String brandName
  ) {
    this.emailService = emailService;
    this.whatsAppService = whatsAppService;
    this.adminWhatsapp = adminWhatsapp;
    this.supportWhatsapp = supportWhatsapp;
    this.brandName = brandName;
  }

  public void notifyPaymentSuccess(AppUser user, Purchase purchase, String unlockedVideoUrl) {
    emailService.sendReceipt(user, purchase, unlockedVideoUrl);
    emailService.sendAdminReceipt(user, purchase, unlockedVideoUrl);

    String amount = formatAmount(purchase != null ? purchase.getAmountPaise() : null);
    String orderId = purchase != null ? safeString(purchase.getRazorpayOrderId()) : "N/A";
    String buyerName = user != null ? safeString(user.getFullName()) : "AS DANCE User";
    String buyerEmail = user != null ? safeString(user.getEmail()) : safeString(purchase != null ? purchase.getBuyerEmail() : null);
    String buyerPhone = purchase != null ? safeString(purchase.getBuyerPhone()) : "Unknown";

    String userMessage = String.join("\n",
        brandName + " payment confirmed.",
        "Amount: " + amount,
        "Order ID: " + orderId,
        "Access: " + safeString(unlockedVideoUrl),
        "Support: " + safeString(supportWhatsapp)
    );

    String adminMessage = String.join("\n",
        brandName + " payment received.",
        "Amount: " + amount,
        "Order ID: " + orderId,
        "Customer: " + buyerName,
        "Email: " + buyerEmail,
        "Phone: " + buyerPhone
    );

    if (purchase != null && purchase.getBuyerPhone() != null) {
      whatsAppService.sendText(purchase.getBuyerPhone(), userMessage);
    }

    if (adminWhatsapp != null && !adminWhatsapp.isBlank()) {
      whatsAppService.sendText(adminWhatsapp, adminMessage);
    }
  }

  private String formatAmount(Integer amountPaise) {
    if (amountPaise == null) return "₹0";
    BigDecimal rupees = new BigDecimal(amountPaise).divide(new BigDecimal(100), 2, RoundingMode.HALF_UP);
    return "₹" + rupees.toPlainString();
  }

  private String safeString(String value) {
    return value == null || value.isBlank() ? "N/A" : value;
  }
}
