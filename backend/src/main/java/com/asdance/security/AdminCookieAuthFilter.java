package com.asdance.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class AdminCookieAuthFilter extends OncePerRequestFilter {

  private final JwtService jwtService;
  private final CookieService cookieService;
  private final String adminEmail;

  public AdminCookieAuthFilter(
      JwtService jwtService,
      CookieService cookieService,
      @Value("${app.admin.email:}") String adminEmail
  ) {
    this.jwtService = jwtService;
    this.cookieService = cookieService;
    this.adminEmail = adminEmail;
  }

  @Override
  protected void doFilterInternal(
      @NonNull HttpServletRequest request,
      @NonNull HttpServletResponse response,
      @NonNull FilterChain filterChain
  )
      throws ServletException, IOException {
    if (!request.getRequestURI().startsWith("/api/admin")) {
      filterChain.doFilter(request, response);
      return;
    }

    if (SecurityContextHolder.getContext().getAuthentication() != null) {
      filterChain.doFilter(request, response);
      return;
    }

    cookieService.readAdminToken(request).ifPresent(token -> {
      try {
        var u = jwtService.parse(token);
        if (adminEmail != null && !adminEmail.isBlank() && !adminEmail.equalsIgnoreCase(u.email())) {
          return;
        }
        var auth = new UsernamePasswordAuthenticationToken(
            u.userId(),
            u.email(),
            List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
        );
        auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(auth);
      } catch (Exception ignored) {
        // invalid token -> ignore
      }
    });

    filterChain.doFilter(request, response);
  }
}
