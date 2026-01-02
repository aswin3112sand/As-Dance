package com.asdance.content;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/content")
public class ReviewController {

  private static final List<ReviewDTO> REVIEWS = Arrays.asList(
      new ReviewDTO("01", "The step breakdown is insane. 196 easy steps helped me fix my foundation in a week.", "Competition Dancer", 0),
      new ReviewDTO("02", "Finally a studio-grade curriculum. No fluff, just pure neon practice drills.", "Stage Performer", 1),
      new ReviewDTO("03", "Worth every rupee. The 3D depth of the interface matches the quality of the dance.", "Pro Choreographer", 2),
      new ReviewDTO("04", "Instant unlock worked perfectly. Support team helped me with a login issue in 5 mins.", "Beginner Student", 3),
      new ReviewDTO("05", "I use the 5-min endurance tracks daily. My stamina has doubled.", "Fitness Enthusiast", 4),
      new ReviewDTO("06", "Best purchases I've made for my dance career. Simple, fast, effective.", "Dance Influencer", 5)
  );

  @GetMapping("/reviews")
  public ResponseEntity<List<ReviewDTO>> getReviews() {
    return ResponseEntity.ok(REVIEWS);
  }
}
