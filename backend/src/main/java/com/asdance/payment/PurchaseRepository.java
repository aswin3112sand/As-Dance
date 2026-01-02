package com.asdance.payment;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PurchaseRepository extends JpaRepository<Purchase, Long> {
  Optional<Purchase> findTopByUserIdOrderByCreatedAtDesc(Long userId);
  Optional<Purchase> findTopByUserIdAndStatusOrderByCreatedAtDesc(Long userId, String status);
  Optional<Purchase> findByRazorpayOrderId(String razorpayOrderId);
  List<Purchase> findByStatusOrderByPaidAtDesc(String status);
  List<Purchase> findByStatusInOrderByPaidAtDesc(List<String> statuses);
}
