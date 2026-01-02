package com.asdance.auth;

import com.asdance.security.AccessPolicy;
import com.asdance.security.JwtService;
import com.asdance.security.CookieService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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
  public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req, HttpServletResponse response) {
    var u = authService.authenticate(req.email(), req.password());
    String token = jwtService.createToken(u.getId(), u.getEmail());

    Cookie cookie = new Cookie(CookieService.TOKEN_COOKIE, token);
    cookie.setHttpOnly(true);
    cookie.setSecure(false); // localhost
    cookie.setPath("/");
    cookie.setMaxAge(60 * 60 * 24 * 30); // 30d
    response.addCookie(cookie);

    return ResponseEntity.ok(new LoginResponse(true, "Login success", u.getId(), u.getEmail(), token));
  }

  @PostMapping("/logout")
  public ResponseEntity<?> logout(HttpServletResponse response) {
    Cookie cookie = new Cookie(CookieService.TOKEN_COOKIE, "");
    cookie.setHttpOnly(true);
    cookie.setSecure(false);
    cookie.setPath("/");
    cookie.setMaxAge(0);
    response.addCookie(cookie);
    return ResponseEntity.ok(new ApiResponse(true, "Logged out"));
  }

  @GetMapping("/me")
  public ResponseEntity<?> me(Authentication auth) {
    if (auth == null) return ResponseEntity.status(401).body(new ApiResponse(false, "Not logged in"));
    Long userId = (Long) auth.getPrincipal();
    String email = (String) auth.getCredentials();
    if (!accessPolicy.isAllowedEmail(email)) {
      return ResponseEntity.status(401).body(new ApiResponse(false, "EMAIL_NOT_ALLOWED"));
    }

    boolean unlocked = authService.isUnlocked(userId);

    // name lookup optional (keep simple)
    return ResponseEntity.ok(new MeResponse(userId, email, "AS DANCE User", unlocked));
  }
}
