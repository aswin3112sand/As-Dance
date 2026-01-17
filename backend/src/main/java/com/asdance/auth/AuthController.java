package com.asdance.auth;

import com.asdance.security.AccessPolicy;
import com.asdance.security.JwtService;
import com.asdance.security.CookieService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import java.time.Duration;
import java.util.Locale;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import static com.asdance.auth.AuthDtos.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  private final AuthService authService;
  private final JwtService jwtService;
  private final AccessPolicy accessPolicy;

  public AuthController(AuthService authService, JwtService jwtService, AccessPolicy accessPolicy) {
    this.authService = authService;
    this.jwtService = jwtService;
    this.accessPolicy = accessPolicy;
  }

  @PostMapping("/register")
  public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
    var u = authService.register(req.email(), req.password(), req.fullName());
    return ResponseEntity.ok(new ApiResponse(true, "Registered: " + u.getEmail()));
  }

  @PostMapping("/login")
  public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req, HttpServletRequest request, HttpServletResponse response) {
    var u = authService.authenticate(req.email(), req.password());
    String token = jwtService.createToken(u.getId(), u.getEmail());
    addAuthCookie(response, request, token, Duration.ofDays(30));

    return ResponseEntity.ok(new LoginResponse(true, "Login success", u.getId(), u.getEmail(), token));
  }

  @PostMapping("/logout")
  public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
    addAuthCookie(response, request, "", Duration.ZERO);
    return ResponseEntity.ok(new ApiResponse(true, "Logged out"));
  }

  @GetMapping("/me")
  public ResponseEntity<?> me(Authentication auth) {
    Authentication current = auth != null ? auth : SecurityContextHolder.getContext().getAuthentication();
    if (current == null) return ResponseEntity.status(401).body(new ApiResponse(false, "Not logged in"));
    Long userId = (Long) current.getPrincipal();
    String email = (String) current.getCredentials();
    if (!accessPolicy.isAllowedEmail(email)) {
      return ResponseEntity.status(401).body(new ApiResponse(false, "EMAIL_NOT_ALLOWED"));
    }

    boolean unlocked = authService.isUnlocked(userId);

    // name lookup optional (keep simple)
    return ResponseEntity.ok(new MeResponse(userId, email, "AS DANCE User", unlocked));
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

  private static void addAuthCookie(HttpServletResponse response, HttpServletRequest request, String value, Duration maxAge) {
    boolean secure = isSecureRequest(request);
    ResponseCookie cookie = ResponseCookie.from(CookieService.TOKEN_COOKIE, value)
        .httpOnly(true)
        .secure(secure)
        .path("/")
        .sameSite("Lax")
        .maxAge(maxAge)
        .build();
    response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
  }
}
