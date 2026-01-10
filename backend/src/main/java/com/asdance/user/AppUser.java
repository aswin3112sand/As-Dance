package com.asdance.user;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="users", uniqueConstraints = @UniqueConstraint(columnNames = "email"))
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppUser {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable=false)
  private String email;

  @Column(nullable=false)
  private String passwordHash;

  @Column(nullable=false)
  private String fullName;

  @Column
  private String externalId;

  @Builder.Default
  @Column(nullable=false)
  private boolean hasAccess = false;

  @Builder.Default
  @Column(nullable=false)
  private boolean enabled = true;
}
