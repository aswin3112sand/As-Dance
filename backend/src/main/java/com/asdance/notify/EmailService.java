package com.asdance.notify;

import com.asdance.payment.Purchase;
import com.asdance.user.AppUser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class EmailService {
  private static final Logger log = LoggerFactory.getLogger(EmailService.class);

  private final ObjectProvider<JavaMailSender> mailSenderProvider;
  private final boolean enabled;
  private final String from;
  private final String adminEmail;
  private final String brandName;
  private final String supportWhatsApp;

  public EmailService(
      ObjectProvider<JavaMailSender> mailSenderProvider,
      @Value("${app.mail.enabled:false}") boolean enabled,
      @Value("${app.mail.from:no-reply@asdance.local}") String from,
      @Value("${app.mail.admin:}") String adminEmail,
      @Value("${app.brand.name:AS DANCE}") String brandName,
      @Value("${app.support.whatsapp:https://wa.me/919999999999}") String supportWhatsApp
  ) {
    this.mailSenderProvider = mailSenderProvider;
    this.enabled = enabled;
    this.from = from;
    this.adminEmail = adminEmail;
    this.brandName = brandName;
    this.supportWhatsApp = supportWhatsApp;
  }

  public void sendReceipt(AppUser user, Purchase purchase, String unlockedVideoUrl) {
    if (!enabled || user == null) {
      return;
    }

    try {
      JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
      if (mailSender == null) {
        log.debug("Mail sender not configured; skipping receipt email.");
        return;
      }
      SimpleMailMessage message = new SimpleMailMessage();
      message.setFrom(from);
      message.setTo(user.getEmail());
      message.setSubject(brandName + " Payment Confirmation");
      message.setText(buildBody(user, purchase, unlockedVideoUrl));
      mailSender.send(message);
    } catch (Exception ex) {
      log.warn("Receipt email failed for user {}", user != null ? user.getEmail() : "unknown", ex);
    }
  }

  public void sendAdminReceipt(AppUser user, Purchase purchase, String unlockedVideoUrl) {
    if (!enabled || adminEmail == null || adminEmail.isBlank()) {
      return;
    }

    try {
      JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
      if (mailSender == null) {
        log.debug("Mail sender not configured; skipping admin receipt email.");
        return;
      }
      SimpleMailMessage message = new SimpleMailMessage();
      message.setFrom(from);
      message.setTo(adminEmail);
      message.setSubject(brandName + " Payment Alert");
      message.setText(buildAdminBody(user, purchase, unlockedVideoUrl));
      mailSender.send(message);
    } catch (Exception ex) {
      log.warn("Admin receipt email failed for {}", adminEmail, ex);
    }
  }

  private String buildBody(AppUser user, Purchase purchase, String unlockedVideoUrl) {
    String orderId = purchase != null ? purchase.getRazorpayOrderId() : "N/A";
    String amount = purchase != null ? formatAmount(purchase.getAmountPaise()) : "₹499";

    return String.join("\n",
        "Hi " + safeName(user) + ",",
        "",
        "Your payment for the AS DANCE – 639 Steps Bundle is confirmed.",
        "Amount: " + amount,
        "Order ID: " + orderId,
        "",
        "Access link:",
        unlockedVideoUrl != null && !unlockedVideoUrl.isBlank() ? unlockedVideoUrl : "Pending link setup",
        "",
        "Need help? WhatsApp: " + supportWhatsApp,
        "",
        "Thank you,",
        brandName + " Team"
    );
  }

  private String buildAdminBody(AppUser user, Purchase purchase, String unlockedVideoUrl) {
    String orderId = purchase != null ? purchase.getRazorpayOrderId() : "N/A";
    String amount = purchase != null ? formatAmount(purchase.getAmountPaise()) : "₹499";
    String userEmail = user != null ? user.getEmail() : "Unknown";
    String userName = user != null ? safeName(user) : "Unknown";
    String phone = purchase != null ? safeString(purchase.getBuyerPhone()) : "Unknown";

    return String.join("\n",
        "New payment received for " + brandName + ".",
        "Amount: " + amount,
        "Order ID: " + orderId,
        "Customer: " + userName,
        "Email: " + userEmail,
        "Phone: " + phone,
        "",
        "Access link:",
        unlockedVideoUrl != null && !unlockedVideoUrl.isBlank() ? unlockedVideoUrl : "Pending link setup"
    );
  }

  private String safeName(AppUser user) {
    String name = user.getFullName();
    return (name == null || name.isBlank()) ? "there" : name;
  }

  private String safeString(String value) {
    return value == null || value.isBlank() ? "Unknown" : value;
  }

  private String formatAmount(Integer amountPaise) {
    if (amountPaise == null) return "₹0";
    BigDecimal rupees = new BigDecimal(amountPaise).divide(new BigDecimal(100), 2, RoundingMode.HALF_UP);
    return "₹" + rupees.toPlainString();
  }
}
