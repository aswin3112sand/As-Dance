package com.asdance.admin;

import com.asdance.payment.Purchase;
import com.asdance.payment.PurchaseRepository;
import com.asdance.user.AppUser;
import com.asdance.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AdminController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
class AdminControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @MockBean
  private PurchaseRepository purchaseRepository;

  @MockBean
  private UserRepository userRepository;

  @Test
  void purchasesReturnsRows() throws Exception {
    Purchase purchase = Purchase.builder()
        .id(10L)
        .userId(1L)
        .status("SUCCESS")
        .amountPaise(49900)
        .createdAt(Instant.parse("2024-01-01T00:00:00Z"))
        .paidAt(Instant.parse("2024-01-02T00:00:00Z"))
        .razorpayOrderId("order_123")
        .razorpayPaymentId("pay_123")
        .build();

    when(purchaseRepository.findByStatusInOrderByPaidAtDesc(List.of("SUCCESS", "PAID")))
        .thenReturn(List.of(purchase));

    AppUser user = AppUser.builder()
        .id(1L)
        .email("testuser@asdance.com")
        .fullName("Test User")
        .passwordHash("hash")
        .build();

    when(userRepository.findAllById(eq(List.of(1L)))).thenReturn(List.of(user));

    mockMvc.perform(get("/api/admin/purchases"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$", hasSize(1)))
        .andExpect(jsonPath("$[0].fullName").value("Test User"))
        .andExpect(jsonPath("$[0].email").value("testuser@asdance.com"))
        .andExpect(jsonPath("$[0].status").value("SUCCESS"))
        .andExpect(jsonPath("$[0].amountPaise").value(49900));
  }
}
