package com.asdance.security;

import com.asdance.auth.GuestUserService;
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
public class GuestAuthFilter extends OncePerRequestFilter {

  private static final java.util.regex.Pattern STATIC_FILE_PATTERN = java.util.regex.Pattern.compile(".*\\.(js|css|png|jpg|jpeg|gif|svg|ico|webp|mp4|webm|woff|woff2|ttf|eot)$");
  private final GuestUserService guestUserService;

  public GuestAuthFilter(GuestUserService guestUserService) {
    this.guestUserService = guestUserService;
  }

  @Override
  protected boolean shouldNotFilter(@NonNull HttpServletRequest request) {
    String path = request.getRequestURI();
    return path.startsWith("/static/")
        || path.startsWith("/assets/")
        || STATIC_FILE_PATTERN.matcher(path).matches()
        || path.equals("/")
        || path.equals("/index.html");
  }

  @Override
  protected void doFilterInternal(
      @NonNull HttpServletRequest request,
      @NonNull HttpServletResponse response,
      @NonNull FilterChain filterChain
  ) throws ServletException, IOException {
    if (guestUserService != null && SecurityContextHolder.getContext().getAuthentication() == null) {
      var guest = guestUserService.getOrCreateGuestUser();
      var auth = new UsernamePasswordAuthenticationToken(
          guest.getId(),
          null,
          List.of(new SimpleGrantedAuthority("ROLE_USER"))
      );
      auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
      SecurityContextHolder.getContext().setAuthentication(auth);
    }

    filterChain.doFilter(request, response);
  }
}
