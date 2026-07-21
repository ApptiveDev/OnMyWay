package _team.onmyway;

import _team.onmyway.controller.apis.MyPageController;
import _team.onmyway.service.auth.JwtService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.Date;

@SpringBootTest
@AutoConfigureMockMvc
public class MyPageTest {

    @Value("${jwt.secret}")
    private String secret;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private MyPageController myPageController;

    @Test
    public void myPageTest() throws Exception {
        // Given
        String jwtAccessToken = jwtService.createAccessToken(4L, "USER");
        // When
        mockMvc.perform(MockMvcRequestBuilders.get("/myPage")
                .header("Authorization", "Bearer " + jwtAccessToken)
                .contentType(MediaType.APPLICATION_JSON))
                // Then
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andDo(MockMvcResultHandlers.print()); // 로깅
    }

    @Test
    public void myPageFailureTest() throws Exception {
        // Given
        String jwtAccessToken = jwtService.createAccessToken(3L, "USER");
        // When
        mockMvc.perform(MockMvcRequestBuilders.get("/myPage")
                        .header("Authorization", "Bearer " + jwtAccessToken)
                        .contentType(MediaType.APPLICATION_JSON))
                // Then
                .andExpect(MockMvcResultMatchers.status().is5xxServerError())
                .andDo(MockMvcResultHandlers.print());
    }

    @Test
    public void myPageAuthFailureTest() throws Exception {
        // Given : 유효기간 만료 키 생성
        String expiredToken = Jwts.builder()
                        .setSubject("4")
                        .setExpiration(new Date(System.currentTimeMillis() - 3600000))
                        .signWith(SignatureAlgorithm.HS256, secret)
                        .compact();

        // When
        mockMvc.perform(MockMvcRequestBuilders.get("/myPage")
                .header("Authorization", "Bearer " + expiredToken)
                .contentType(MediaType.APPLICATION_JSON))
                // Then
                .andExpect(MockMvcResultMatchers.status().isUnauthorized())
                .andDo(MockMvcResultHandlers.print());
    }
}
