package com.asdance.payment;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name="purchases")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Purchase {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable=false)
  private Long userId;

  @Column(nullable=false)
  private String status; // CREATED, PAID, SUCCESS

  private String externalUserId;

  private String razorpayOrderId;
  private String razorpayPaymentId;

  @Column(nullable=false)
  private Integer amountPaise;

  @Column(nullable=false)
  private Instant createdAt;

  private Instant paidAt;
  private Instant downloadedAt;
  private Instant notifiedAt;

  private String buyerName;
  private String buyerEmail;
  private String buyerPhone;
}
