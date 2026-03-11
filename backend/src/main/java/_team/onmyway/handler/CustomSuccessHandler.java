package _team.onmyway.handler;

import _team.onmyway.entity.OAuthAccounts;
import _team.onmyway.entity.Users;
import _team.onmyway.repository.OAuthAccountsRepository;
import _team.onmyway.repository.UsersRepository;
import _team.onmyway.security.CustomOAuth2User;
import _team.onmyway.service.CustomOAuthUserService;
import _team.onmyway.service.JwtService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class CustomSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final UsersRepository usersRepository;

    @Override
    @Transactional
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        CustomOAuth2User customUser = (CustomOAuth2User) authentication.getPrincipal();
        Users user = customUser.getUser();

        // JWT 발급
        String accessToken = jwtService.createAccessToken(
                user.getId(),
                user.getRole().name());
        String refreshToken = jwtService.createRefreshToken(user.getId().toString());

        // hashedRefreshToken DB 저장
        String hashedRefreshToken = jwtService.hashToken(refreshToken);
        user.updateRefreshToken(hashedRefreshToken);
        usersRepository.save(user);

        // 쿠키에 담기 (HttpOnly + Secure)
        Cookie accessCookie = new Cookie("accessToken", accessToken);
        accessCookie.setHttpOnly(true);
        accessCookie.setSecure(false); // 개발 시 false, 배포 시 true
        accessCookie.setPath("/");
        accessCookie.setMaxAge((int) (jwtService.getAccessTokenExpirationMs() / 1000));

        Cookie refreshCookie = new Cookie("refreshToken", refreshToken);
        refreshCookie.setHttpOnly(true);
        refreshCookie.setSecure(false);
        refreshCookie.setPath("/");
        refreshCookie.setMaxAge((int) (jwtService.getRefreshTokenExpirationMs() / 1000));

        response.addCookie(accessCookie);
        response.addCookie(refreshCookie);

        // JSON body로 최소 정보 전달
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        String json = """
            {
                "message": "OAuth login success",
                "userId": %d
            }
            """.formatted(user.getId());
        response.getWriter().write(json);

        // React 앱으로 리다이렉트
        response.sendRedirect("http://localhost:3000/oauth-success");
    }
}