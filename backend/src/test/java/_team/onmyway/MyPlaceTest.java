package _team.onmyway;

import _team.onmyway.controller.MyPlaceController;
import _team.onmyway.service.JwtService;
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

@SpringBootTest
@AutoConfigureMockMvc
public class MyPlaceTest {
    @Value("${jwt.secret}")
    private String secret;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private MyPlaceController myPlaceController;

    @Test
    public void myPlaceTest() throws Exception {
        // Given
        String jwtAccessToken = jwtService.createAccessToken(4L, "USER");
        // When
        mockMvc.perform(MockMvcRequestBuilders.get("/api/myPlace")
                        .header("Authorization", "Bearer " + jwtAccessToken)
                        .queryParam("lat", "35.23158986510938")
                        .queryParam("lon","129.08424069637786")
                        .contentType(MediaType.APPLICATION_JSON))
                // Then
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andDo(MockMvcResultHandlers.print()); // 로깅
    }
}
