package com.asdance.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Profile;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Profile("!test")
public class JwtAuthFilter extends OncePerRequestFilter {

  private final CookieService cookieService;
  private final JwtService jwtService;

  public JwtAuthFilter(CookieService cookieService, JwtService jwtService) {
    this.cookieService = cookieService;
    this.jwtService = jwtService;
  }

  @Override
  protected void doFilterInternal(
      @NonNull HttpServletRequest request,
      @NonNull HttpServletResponse response,
      @NonNull FilterChain filterChain
  ) throws ServletException, IOException {
    if (SecurityContextHolder.getContext().getAuthentication() != null) {
      filterChain.doFilter(request, response);
      return;
    }

    try {
      var token = cookieService.readToken(request);
      if (token.isPresent()) {
        var jwtUser = jwtService.parse(token.get());
        var auth = new UsernamePasswordAuthenticationToken(
            jwtUser.userId(),
            jwtUser.email(),
            List.of(new SimpleGrantedAuthority("ROLE_USER"))
        );
        auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(auth);
      }
    } catch (Exception e) {
      // Invalid token, continue without authentication
    }

    filterChain.doFilter(request, response);
  }
}
