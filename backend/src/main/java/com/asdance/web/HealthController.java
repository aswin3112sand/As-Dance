package com.asdance.web;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {
  @GetMapping("/health")
  public Map<String, Object> health() {
    return Map.of("ok", true, "service", "as-dance", "port", 8085);
  }
}
