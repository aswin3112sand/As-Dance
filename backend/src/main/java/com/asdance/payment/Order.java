package com.asdance.payment;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "user_id", nullable = false)
  private Long userId;

  @Column(name = "course_id", nullable = false)
  private Long courseId;

  @Column(nullable = false)
  private Integer amount;

  @Column(name = "order_id", nullable = false, unique = true)
  private String orderId;

  @Column(name = "payment_id")
  private String paymentId;

  @Column(nullable = false)
  private String status; // created, paid
}
