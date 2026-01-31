package com.asdance.payment;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
  Optional<Order> findByOrderId(String orderId);
  boolean existsByPaymentId(String paymentId);
  boolean existsByUserIdAndStatusIgnoreCase(Long userId, String status);
}
