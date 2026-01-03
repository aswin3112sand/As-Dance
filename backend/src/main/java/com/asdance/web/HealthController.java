package com.asdance.web;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HealthController {
  private final int port;

  public HealthController(@Value("${server.port:8080}") int port) {
    this.port = port;
  }

  @GetMapping({"/health", "/api/health"})
  public Map<String, Object> health() {
    return Map.of("ok", true, "service", "as-dance", "port", port);
  }
}
