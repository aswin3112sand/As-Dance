package com.asdance.content;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ContentLinksController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
class ContentLinksControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Test
  void demosReturnsConfiguredLinks() throws Exception {
    mockMvc.perform(get("/api/content/demos"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.demo1").value("https://example.com/demo1"))
        .andExpect(jsonPath("$.demo2").value("https://example.com/demo2"))
        .andExpect(jsonPath("$.demo3").value("https://example.com/demo3"))
        .andExpect(jsonPath("$.demo4").value("https://example.com/demo4"));
  }
}
