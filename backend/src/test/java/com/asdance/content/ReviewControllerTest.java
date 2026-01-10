package com.asdance.content;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ReviewController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
class ReviewControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Test
  void reviewsReturnsList() throws Exception {
    mockMvc.perform(get("/api/content/reviews"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$", hasSize(6)));
  }
}
