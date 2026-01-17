package com.asdance.admin;

import com.asdance.security.CookieService;
import com.asdance.security.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.time.Duration;
import java.util.Locale;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.asdance.admin.AdminDtos.*;

@RestController
@RequestMapping("/api/admin")
public class AdminAuthController {

  private final JwtService jwtService;
  private final String adminEmail;
  private final String adminPassword;

  public AdminAuthController(
      JwtService jwtService,
      @Value("${app.admin.email:}") String adminEmail,
      @Value("${app.admin.password:}") String adminPassword
  ) {
    this.jwtService = jwtService;
    this.adminEmail = adminEmail;
    this.adminPassword = adminPassword;
  }

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody AdminLoginRequest req, HttpServletRequest request, HttpServletResponse response) {
    if (req == null || req.email() == null || req.password() == null) {
      return ResponseEntity.status(400).body(new ApiResponse(false, "Missing credentials"));
    }
    if (adminEmail == null || adminEmail.isBlank() || adminPassword == null || adminPassword.isBlank()) {
      return ResponseEntity.status(400).body(new ApiResponse(false, "Admin credentials not configured"));
    }
    if (!adminEmail.equalsIgnoreCase(req.email()) || !adminPassword.equals(req.password())) {
      return ResponseEntity.status(401).body(new ApiResponse(false, "Invalid admin credentials"));
    }

    String token = jwtService.createToken(0L, adminEmail);
    addAdminCookie(response, request, token, Duration.ofHours(8));

    return ResponseEntity.ok(new ApiResponse(true, "Admin login success"));
  }

  @PostMapping("/logout")
  public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
    addAdminCookie(response, request, "", Duration.ZERO);
    return ResponseEntity.ok(new ApiResponse(true, "Admin logged out"));
  }

  private static boolean isSecureRequest(HttpServletRequest request) {
    if (request == null) {
      return false;
    }
    if (request.isSecure()) {
      return true;
    }
    String forwardedProto = request.getHeader("X-Forwarded-Proto");
    if (forwardedProto != null) {
      return forwardedProto.toLowerCase(Locale.ROOT).startsWith("https");
    }
    String forwardedSsl = request.getHeader("X-Forwarded-Ssl");
    return "on".equalsIgnoreCase(forwardedSsl);
  }

  private static void addAdminCookie(HttpServletResponse response, HttpServletRequest request, String value, Duration maxAge) {
    boolean secure = isSecureRequest(request);
    ResponseCookie cookie = ResponseCookie.from(CookieService.ADMIN_COOKIE, value)
        .httpOnly(true)
        .secure(secure)
        .path("/")
        .sameSite("Strict")
        .maxAge(maxAge)
        .build();
    response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
  }
}
