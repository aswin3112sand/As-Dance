package com.asdance.user;

import com.asdance.payment.PaymentService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserAccessController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
class UserAccessControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @MockBean
  private PaymentService paymentService;

  @Test
  void accessReturnsLockedWhenNoAuth() throws Exception {
    mockMvc.perform(get("/api/user/access"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.unlocked").value(false));
  }

  @Test
  void accessReturnsUnlockedWhenServiceAllows() throws Exception {
    when(paymentService.isUnlocked(any())).thenReturn(true);
    TestingAuthenticationToken auth = new TestingAuthenticationToken(1L, "testuser@asdance.com");

    mockMvc.perform(get("/api/user/access").principal(auth))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.unlocked").value(true));
  }
}
