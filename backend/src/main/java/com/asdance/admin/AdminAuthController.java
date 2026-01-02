package com.asdance.admin;

import com.asdance.security.CookieService;
import com.asdance.security.JwtService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
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
  public ResponseEntity<?> login(@RequestBody AdminLoginRequest req, HttpServletResponse response) {
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
    Cookie cookie = new Cookie(CookieService.ADMIN_COOKIE, token);
    cookie.setHttpOnly(true);
    cookie.setSecure(false);
    cookie.setPath("/");
    cookie.setMaxAge(60 * 60 * 8);
    response.addCookie(cookie);

    return ResponseEntity.ok(new ApiResponse(true, "Admin login success"));
  }

  @PostMapping("/logout")
  public ResponseEntity<?> logout(HttpServletResponse response) {
    Cookie cookie = new Cookie(CookieService.ADMIN_COOKIE, "");
    cookie.setHttpOnly(true);
    cookie.setSecure(false);
    cookie.setPath("/");
    cookie.setMaxAge(0);
    response.addCookie(cookie);
    return ResponseEntity.ok(new ApiResponse(true, "Admin logged out"));
  }
}
