package _team.onmyway;

import _team.onmyway.service.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

@SpringBootTest
@AutoConfigureMockMvc
public class MyPageTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtService jwtService;

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
}
