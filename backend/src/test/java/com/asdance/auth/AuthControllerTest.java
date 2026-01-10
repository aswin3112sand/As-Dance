package com.asdance.auth;

import com.asdance.security.AccessPolicy;
import com.asdance.security.JwtService;
import com.asdance.user.AppUser;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
class AuthControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @MockBean
  private AuthService authService;

  @MockBean
  private JwtService jwtService;

  @MockBean
  private AccessPolicy accessPolicy;

  @Test
  void registerOk() throws Exception {
    AppUser user = AppUser.builder()
        .id(1L)
        .email("testuser@asdance.com")
        .passwordHash("hash")
        .fullName("Test User")
        .build();
    when(authService.register(eq("testuser@asdance.com"), eq("pass123"), eq("Test User"))).thenReturn(user);

    mockMvc.perform(post("/api/auth/register")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"email\":\"testuser@asdance.com\",\"password\":\"pass123\",\"fullName\":\"Test User\"}"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.ok").value(true));
  }

  @Test
  void loginSetsCookie() throws Exception {
    AppUser user = AppUser.builder()
        .id(1L)
        .email("testuser@asdance.com")
        .passwordHash("hash")
        .fullName("Test User")
        .build();
    when(authService.authenticate(eq("testuser@asdance.com"), eq("pass123"))).thenReturn(user);
    when(jwtService.createToken(1L, "testuser@asdance.com")).thenReturn("token-value");

    mockMvc.perform(post("/api/auth/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"email\":\"testuser@asdance.com\",\"password\":\"pass123\"}"))
        .andExpect(status().isOk())
        .andExpect(header().string("Set-Cookie", containsString("asdance_token=")))
        .andExpect(jsonPath("$.ok").value(true))
        .andExpect(jsonPath("$.email").value("testuser@asdance.com"));
  }

  @Test
  void meUnauthorizedWhenNoAuth() throws Exception {
    mockMvc.perform(get("/api/auth/me"))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.ok").value(false));
  }

  @Test
  void meOkWhenAuthed() throws Exception {
    TestingAuthenticationToken auth = new TestingAuthenticationToken(1L, "testuser@asdance.com");
    when(accessPolicy.isAllowedEmail("testuser@asdance.com")).thenReturn(true);
    when(authService.isUnlocked(1L)).thenReturn(true);

    mockMvc.perform(get("/api/auth/me").principal(auth))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.email").value("testuser@asdance.com"))
        .andExpect(jsonPath("$.unlocked").value(true));
  }
}
