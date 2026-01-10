package com.asdance.notify;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.Map;

@Service
public class WhatsAppService {
  private static final Logger log = LoggerFactory.getLogger(WhatsAppService.class);

  private final RestTemplate restTemplate;
  private final boolean enabled;
  private final String provider;
  private final String metaToken;
  private final String metaPhoneNumberId;
  private final String metaApiBase;
  private final String gupshupApiKey;
  private final String gupshupAppName;
  private final String gupshupUrl;

  public WhatsAppService(
      RestTemplateBuilder restTemplateBuilder,
      @Value("${app.whatsapp.enabled:false}") boolean enabled,
      @Value("${app.whatsapp.provider:meta}") String provider,
      @Value("${app.whatsapp.metaToken:}") String metaToken,
      @Value("${app.whatsapp.metaPhoneNumberId:}") String metaPhoneNumberId,
      @Value("${app.whatsapp.metaApiBase:https://graph.facebook.com/v19.0}") String metaApiBase,
      @Value("${app.whatsapp.gupshupApiKey:}") String gupshupApiKey,
      @Value("${app.whatsapp.gupshupAppName:}") String gupshupAppName,
      @Value("${app.whatsapp.gupshupUrl:https://api.gupshup.io/sm/api/v1/msg}") String gupshupUrl
  ) {
    this.restTemplate = restTemplateBuilder
        .connectTimeout(Duration.ofSeconds(6))
        .readTimeout(Duration.ofSeconds(10))
        .build();
    this.enabled = enabled;
    this.provider = provider == null ? "meta" : provider.trim().toLowerCase();
    this.metaToken = metaToken;
    this.metaPhoneNumberId = metaPhoneNumberId;
    this.metaApiBase = metaApiBase;
    this.gupshupApiKey = gupshupApiKey;
    this.gupshupAppName = gupshupAppName;
    this.gupshupUrl = gupshupUrl;
  }

  public void sendText(String toRaw, String message) {
    if (!enabled) {
      return;
    }
    String to = normalizePhone(toRaw);
    if (to == null) {
      log.warn("WhatsApp send skipped; invalid phone {}", toRaw);
      return;
    }

    try {
      if ("gupshup".equals(provider)) {
        sendViaGupshup(to, message);
      } else {
        sendViaMeta(to, message);
      }
    } catch (Exception ex) {
      log.warn("WhatsApp send failed for {}", to, ex);
    }
  }

  private void sendViaMeta(String to, String message) {
    if (metaToken == null || metaToken.isBlank() || metaPhoneNumberId == null || metaPhoneNumberId.isBlank()) {
      log.warn("WhatsApp Meta config missing; skipping send.");
      return;
    }
    String url = String.format("%s/%s/messages", metaApiBase, metaPhoneNumberId);

    HttpHeaders headers = new HttpHeaders();
    headers.setBearerAuth(metaToken);
    headers.setContentType(MediaType.APPLICATION_JSON);

    Map<String, Object> payload = Map.of(
        "messaging_product", "whatsapp",
        "to", to,
        "type", "text",
        "text", Map.of("body", message)
    );

    restTemplate.postForEntity(url, new HttpEntity<>(payload, headers), String.class);
  }

  private void sendViaGupshup(String to, String message) {
    if (gupshupApiKey == null || gupshupApiKey.isBlank() || gupshupAppName == null || gupshupAppName.isBlank()) {
      log.warn("WhatsApp Gupshup config missing; skipping send.");
      return;
    }

    HttpHeaders headers = new HttpHeaders();
    headers.set("apikey", gupshupApiKey);
    headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

    MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
    body.add("channel", "whatsapp");
    body.add("source", gupshupAppName);
    body.add("destination", to);
    body.add("message", message);
    body.add("src.name", gupshupAppName);

    restTemplate.postForEntity(gupshupUrl, new HttpEntity<>(body, headers), String.class);
  }

  private String normalizePhone(String raw) {
    if (raw == null) return null;
    String digits = raw.replaceAll("\\D", "");
    if (digits.length() < 10) return null;
    return digits;
  }
}
