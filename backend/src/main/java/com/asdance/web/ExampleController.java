package com.asdance.web;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Example REST Controller
 * All endpoints are public (no authentication required)
 * Frontend calls these via relative paths: /api/example/...
 */
@RestController
@RequestMapping("/api/example")
public class ExampleController {

  /**
   * GET /api/example/data
   * Frontend call: apiFetch('/api/example/data')
   */
  @GetMapping("/data")
  public Map<String, Object> getData() {
    return Map.of(
        "message", "Hello from backend",
        "timestamp", System.currentTimeMillis(),
        "service", "as-dance"
    );
  }

  /**
   * POST /api/example/echo
   * Frontend call: apiFetch('/api/example/echo', {
   *   method: 'POST',
   *   body: JSON.stringify({ text: 'hello' })
   * })
   */
  @PostMapping("/echo")
  public Map<String, Object> echo(@RequestBody Map<String, String> request) {
    return Map.of(
        "received", request.get("text"),
        "echoed", request.get("text"),
        "timestamp", System.currentTimeMillis()
    );
  }

  /**
   * GET /api/example/status
   * Frontend call: apiFetch('/api/example/status')
   */
  @GetMapping("/status")
  public Map<String, String> status() {
    return Map.of(
        "status", "running",
        "database", "connected",
        "version", "1.0.0"
    );
  }
}
