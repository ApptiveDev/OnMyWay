package _team.onmyway.handler;

import _team.onmyway.entity.OAuthAccounts;
import _team.onmyway.entity.Users;
import _team.onmyway.repository.OAuthAccountsRepository;
import _team.onmyway.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class CustomSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final OAuthAccountsRepository oauthAccountsRepository;

    @Override
    @Transactional
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {

        // authentication.getName()은 providerId
        String providerId = authentication.getName();

        // OAuthAccounts 기준 Users 조회
        OAuthAccounts account = oauthAccountsRepository.findByProviderAndProviderUserId(OAuthAccounts.Provider.KAKAO, providerId);
        if (account == null) {
            System.out.println("로그인 실패: DB에 사용자 없음 - " + providerId);
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "User not found");
            return;
        }

        Users user = account.getUser();

        // JWT 발급
        String accessToken = jwtService.createAccessToken(String.valueOf(user.getId()));
        String refreshToken = jwtService.createRefreshToken(String.valueOf(user.getId()));

        // RefreshToken DB 저장
        user.updateRefreshToken(refreshToken);

        // OAuthAccounts와 Users 저장
        // usersRepository.save(user); // 필요하면 사용, 이미 JPA 관리 중이라면 없어도 됨

        // 클라이언트에 JWT 응답
        response.setHeader("Authorization", "Bearer " + accessToken);
        response.setHeader("Refresh-Token", refreshToken);
        response.setContentType("application/json");
        response.getWriter().write("{\"accessToken\": \"" + accessToken + "\", \"refreshToken\": \"" + refreshToken + "\"}");
    }
}