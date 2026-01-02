package com.asdance.admin;

import com.asdance.payment.PurchaseRepository;
import com.asdance.user.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import static com.asdance.admin.AdminDtos.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

  private final PurchaseRepository purchaseRepository;
  private final UserRepository userRepository;

  public AdminController(PurchaseRepository purchaseRepository, UserRepository userRepository) {
    this.purchaseRepository = purchaseRepository;
    this.userRepository = userRepository;
  }

  @GetMapping("/purchases")
  public ResponseEntity<?> purchases(Authentication auth) {
    // Auth is required by security config; keep endpoint simple for now.
    var purchases = purchaseRepository.findByStatusInOrderByPaidAtDesc(List.of("SUCCESS", "PAID"));

    var userIds = purchases.stream()
        .map(p -> p.getUserId())
        .filter(Objects::nonNull)
        .distinct()
        .collect(Collectors.toList());

    Map<Long, com.asdance.user.AppUser> userMap = new HashMap<>();
    if (!userIds.isEmpty()) {
      userRepository.findAllById(userIds).forEach(u -> userMap.put(u.getId(), u));
    }

    List<PurchaseRow> rows = purchases.stream()
        .map(p -> {
          var u = userMap.get(p.getUserId());
          String name = u != null ? u.getFullName() : "Unknown";
          String email = u != null ? u.getEmail() : "Unknown";
          return new PurchaseRow(
              p.getId(),
              p.getUserId(),
              name,
              email,
              p.getStatus(),
              p.getAmountPaise(),
              p.getRazorpayOrderId(),
              p.getRazorpayPaymentId(),
              p.getCreatedAt(),
              p.getPaidAt(),
              p.getDownloadedAt()
          );
        })
        .collect(Collectors.toList());

    return ResponseEntity.ok(rows);
  }
}
