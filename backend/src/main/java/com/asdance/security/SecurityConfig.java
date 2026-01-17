package com.asdance.security;

import com.asdance.auth.GuestUserService;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@Profile("!test")
public class SecurityConfig {

    private final CookieService cookieService;
    private final JwtService jwtService;
    private final String adminEmail;
    private static final String CONTENT_SECURITY_POLICY =
            "default-src 'self'; " +
            "base-uri 'self'; " +
            "object-src 'none'; " +
            "frame-ancestors 'self'; " +
            "form-action 'self'; " +
            "script-src 'self' 'unsafe-inline' https://checkout.razorpay.com; " +
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
            "img-src 'self' data: https: blob:; " +
            "font-src 'self' https://fonts.gstatic.com data:; " +
            "connect-src 'self' https: ws: wss:; " +
            "frame-src 'self' https://checkout.razorpay.com https://api.razorpay.com; " +
            "media-src 'self' https: data: blob:;";

    public SecurityConfig(CookieService cookieService,
                          JwtService jwtService,
                          @Value("${app.admin.email:}") String adminEmail) {
        this.cookieService = cookieService;
        this.jwtService = jwtService;
        this.adminEmail = adminEmail;
    }

    @Bean
    public AdminCookieAuthFilter adminCookieAuthFilter() {
        return new AdminCookieAuthFilter(jwtService, cookieService, adminEmail);
    }

    @Bean
    public JwtCookieAuthFilter jwtCookieAuthFilter() {
        return new JwtCookieAuthFilter(jwtService, cookieService);
    }

    @Bean
    public JwtAuthFilter jwtAuthFilter() {
        return new JwtAuthFilter(cookieService, jwtService);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, ObjectProvider<GuestUserService> guestUserServiceProvider) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .logout(AbstractHttpConfigurer::disable)
                .headers(headers -> headers
                        .httpStrictTransportSecurity(hsts -> hsts
                                .includeSubDomains(true)
                                .maxAgeInSeconds(31536000))
                        .contentSecurityPolicy(csp -> csp.policyDirectives(CONTENT_SECURITY_POLICY)))
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/",
                                "/index.html",
                                "/login",
                                "/register",
                                "/api/auth/**",
                                "/assets/**",
                                "/*.js",
                                "/*.css",
                                "/*.ico",
                                "/*.png",
                                "/*.jpg",
                                "/*.jpeg",
                                "/*.gif",
                                "/*.svg",
                                "/*.webp",
                                "/*.mp4",
                                "/*.webm",
                                "/*.woff",
                                "/*.woff2",
                                "/*.ttf",
                                "/*.eot"
                        ).permitAll()
                        .anyRequest().authenticated())
                .addFilterBefore(new GuestAuthFilter(guestUserServiceProvider.getIfAvailable(() -> null)), UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(jwtAuthFilter(), GuestAuthFilter.class)
                .addFilterBefore(jwtCookieAuthFilter(), JwtAuthFilter.class)
                .addFilterBefore(adminCookieAuthFilter(), JwtCookieAuthFilter.class);

        return http.build();
    }
}
