package com.asdance.admin;

import com.asdance.security.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AdminAuthController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
class AdminAuthControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @MockBean
  private JwtService jwtService;

  @Test
  void loginFailsForWrongCredentials() throws Exception {
    mockMvc.perform(post("/api/admin/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"email\":\"test-admin@asdance.com\",\"password\":\"wrong\"}"))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.ok").value(false));
  }

  @Test
  void loginOkSetsCookie() throws Exception {
    when(jwtService.createToken(eq(0L), eq("test-admin@asdance.com"))).thenReturn("admin-token");

    mockMvc.perform(post("/api/admin/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"email\":\"test-admin@asdance.com\",\"password\":\"test123\"}"))
        .andExpect(status().isOk())
        .andExpect(header().string("Set-Cookie", containsString("asdance_admin=")))
        .andExpect(jsonPath("$.ok").value(true));
  }
}
