package com.asdance.payment;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
  boolean existsByPaymentId(String paymentId);
  boolean existsByOrderId(String orderId);
}
