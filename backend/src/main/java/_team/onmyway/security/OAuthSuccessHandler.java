package _team.onmyway.security;

import _team.onmyway.entity.Users;
import _team.onmyway.repository.UsersRepository;
import _team.onmyway.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuthSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final UsersRepository usersRepository;

    @Override
    @Transactional
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        CustomOAuth2User customUser = (CustomOAuth2User) authentication.getPrincipal();
        Users user = customUser.getUser();

        // JWT 발급
        String refreshToken = jwtService.createRefreshToken(user.getId().toString());

        // hashedRefreshToken DB 저장
        String hashedRefreshToken = jwtService.hashToken(refreshToken);
        user.updateRefreshToken(hashedRefreshToken);
        usersRepository.save(user);

        // 쿠키에 담기 (HttpOnly + Secure)
        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(false)       // 변경
                .path("/")
                .sameSite("Lax")   // "None"으로 변경
                .maxAge(jwtService.getRefreshTokenExpirationMs() / 1000)
                .build();

        response.addHeader("Set-Cookie", cookie.toString());

        response.sendRedirect("http://localhost:8080/swagger-ui/index.html");
    }
}