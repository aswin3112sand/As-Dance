package com.asdance.web;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(HealthController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
class HealthControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Test
  void healthReturnsOk() throws Exception {
    mockMvc.perform(get("/health"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.ok").value(true))
        .andExpect(jsonPath("$.service").value("as-dance"))
        .andExpect(jsonPath("$.port").isNumber());
  }

  @Test
  void apiHealthReturnsOk() throws Exception {
    mockMvc.perform(get("/api/health"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.ok").value(true))
        .andExpect(jsonPath("$.service").value("as-dance"))
        .andExpect(jsonPath("$.port").isNumber());
  }
}
