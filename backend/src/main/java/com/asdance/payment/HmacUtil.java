package com.asdance.payment;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

public class HmacUtil {
  public static String hmacSha256(String data, String key) throws Exception {
    Mac sha256Hmac = Mac.getInstance("HmacSHA256");
    SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
    sha256Hmac.init(secretKey);
    byte[] hash = sha256Hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));
    return toHex(hash);
  }

  private static String toHex(byte[] bytes) {
    StringBuilder sb = new StringBuilder(bytes.length * 2);
    for (byte b : bytes) {
      sb.append(String.format("%02x", b));
    }
    return sb.toString();
  }
}
