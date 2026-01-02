package com.asdance.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.util.Date;

@Component
public class JwtService {

  private final Key key;
  private final String issuer;
  private final int expMinutes;

  public JwtService(
      @Value("${app.jwt.secret}") String secret,
      @Value("${app.jwt.issuer}") String issuer,
      @Value("${app.jwt.expMinutes}") int expMinutes
  ) {
    // Ensure secret length >= 32 bytes
    this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    this.issuer = issuer;
    this.expMinutes = expMinutes;
  }

  public String createToken(Long userId, String email) {
    Instant now = Instant.now();
    Instant exp = now.plusSeconds((long) expMinutes * 60L);
    return Jwts.builder()
        .issuer(issuer)
        .subject(String.valueOf(userId))
        .claim("email", email)
        .issuedAt(Date.from(now))
        .expiration(Date.from(exp))
        .signWith(key)
        .compact();
  }

  public JwtUser parse(String token) {
    var claims = Jwts.parser()
        .verifyWith((javax.crypto.SecretKey) key)
        .build()
        .parseSignedClaims(token)
        .getPayload();

    Long userId = Long.valueOf(claims.getSubject());
    String email = claims.get("email", String.class);
    return new JwtUser(userId, email);
  }

  public record JwtUser(Long userId, String email) {}
}
