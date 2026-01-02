package com.asdance.content;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/content")
public class ContentLinksController {

  @Value("${app.links.demo1}") private String demo1;
  @Value("${app.links.demo2}") private String demo2;
  @Value("${app.links.demo3}") private String demo3;
  @Value("${app.links.demo4}") private String demo4;

  @GetMapping("/demos")
  public ResponseEntity<?> demos() {
    return ResponseEntity.ok(Map.of(
        "demo1", demo1,
        "demo2", demo2,
        "demo3", demo3,
        "demo4", demo4
    ));
  }
}
