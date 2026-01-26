package com.asdance.payment;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class WebhookService {

    private static final Logger logger = LoggerFactory.getLogger(WebhookService.class);

    @Value("${app.razorpay.webhookSecret}")
    private String webhookSecret;

    @Autowired
    private PurchaseRepository purchaseRepository;

    @Transactional
    public void processWebhook(String payload, String signature) {
        logger.debug("Received Razorpay webhook.");

        // 1. Verify the signature
        if (!HmacUtil.verifySignature(payload, signature, webhookSecret)) {
            throw new SecurityException("Webhook signature does not match.");
        }

        // 2. Parse the payload
        JSONObject jsonPayload = new JSONObject(payload);
        String event = jsonPayload.getString("event");
        logger.info("Processing Razorpay event: {}", event);

        // 3. Handle the event
        switch (event) {
            case "refund.processed":
                handleRefundProcessed(jsonPayload);
                break;
            case "refund.failed":
                handleRefundFailed(jsonPayload);
                break;
            default:
                logger.warn("Received unhandled Razorpay event: {}", event);
        }
    }

    private void handleRefundProcessed(JSONObject payload) {
        JSONObject refundEntity = payload.getJSONObject("payload").getJSONObject("refund").getJSONObject("entity");
        String paymentId = refundEntity.getString("payment_id");

        Optional<Purchase> purchaseOpt = purchaseRepository.findByRazorpayPaymentId(paymentId);
        if (purchaseOpt.isPresent()) {
            Purchase purchase = purchaseOpt.get();
            // Consider adding more specific statuses like PARTIALLY_REFUNDED if you check
            // the amount
            purchase.setStatus("REFUNDED");
            purchaseRepository.save(purchase);
            logger.info("Refund processed for paymentId: {}. Purchase ID {} status updated to REFUNDED.", paymentId,
                    purchase.getId());
        } else {
            logger.warn("Received refund.processed webhook for an unknown paymentId: {}", paymentId);
        }
    }

    private void handleRefundFailed(JSONObject payload) {
        JSONObject refundEntity = payload.getJSONObject("payload").getJSONObject("refund").getJSONObject("entity");
        String paymentId = refundEntity.getString("payment_id");

        // You might want to update the status to 'REFUND_FAILED' and notify an admin
        logger.error("Refund FAILED for paymentId: {}. Manual intervention may be required.", paymentId);
        purchaseRepository.findByRazorpayPaymentId(paymentId).ifPresent(purchase -> {
            purchase.setStatus("REFUND_FAILED");
            purchaseRepository.save(purchase);
        });
    }
}