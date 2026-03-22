package _team.onmyway.controller;

import _team.onmyway.dto.RefreshRequest;
import _team.onmyway.entity.Users;
import _team.onmyway.repository.UsersRepository;
import _team.onmyway.service.JwtService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final JwtService jwtService;
    private final UsersRepository usersRepository;

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(
            @CookieValue(name = "refreshToken", required = false) String refreshToken,
            HttpServletResponse response) {

        if (refreshToken == null) {
            return ResponseEntity.status(401).body("No refresh token");
        }

        // JWT 검증
        if (!jwtService.validateToken(refreshToken)) {
            return ResponseEntity.status(401).body("Invalid refresh token");
        }

        String userId = jwtService.getSubject(refreshToken);

        Users user = usersRepository.findById(Long.parseLong(userId))
                .orElseThrow();

        // DB hash 비교
        String hashedToken = jwtService.hashToken(refreshToken);

        if (!hashedToken.equals(user.getRefreshToken())) {
            return ResponseEntity.status(401).body("Refresh token mismatch");
        }

        // 새 AccessToken 발급
        String newAccessToken = jwtService.createAccessToken(
                user.getId(),
                user.getRole().name()
        );

        // 새 RefreshToken 발급 (rotation)
        String newRefreshToken = jwtService.createRefreshToken(String.valueOf(user.getId()));

        // DB refreshToken hash 업데이트
        user.updateRefreshToken(jwtService.hashToken(newRefreshToken));
        usersRepository.save(user);

        // cookie 교체
        ResponseCookie cookie = ResponseCookie.from("refreshToken", newRefreshToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .sameSite("None")
                .maxAge(jwtService.getRefreshTokenExpirationMs() / 1000)
                .build();

        response.addHeader("Set-Cookie", cookie.toString());

        return ResponseEntity.ok(
                Map.of("accessToken", newAccessToken)
        );
    }

    @Profile("dev")
    @PostMapping("/refresh-test")
    public ResponseEntity<?> refreshTest(@RequestBody RefreshRequest request) {

        String refreshToken = request.getRefreshToken();

        if (!jwtService.validateToken(refreshToken)) {
            return ResponseEntity.status(401).body("Invalid refresh token");
        }

        String userId = jwtService.getSubject(refreshToken);

        Users user = usersRepository.findById(Long.parseLong(userId))
                .orElseThrow();

        String hashedToken = jwtService.hashToken(refreshToken);

        if (!hashedToken.equals(user.getRefreshToken())) {
            return ResponseEntity.status(401).body("Refresh token mismatch");
        }

        String accessToken = jwtService.createAccessToken(
                user.getId(),
                user.getRole().name()
        );

        return ResponseEntity.ok(
                Map.of(
                        "accessToken", accessToken,
                        "userId", user.getId()
                )
        );
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            @CookieValue(name = "refreshToken", required = false) String refreshToken,
            HttpServletResponse response) {

        // 1. 리프레시 토큰이 존재할 경우에만 DB 작업 수행
        if (refreshToken != null) {
            try {
                if (jwtService.validateToken(refreshToken)) {
                    String userId = jwtService.getSubject(refreshToken);

                    usersRepository.findById(Long.parseLong(userId))
                            .ifPresent(user -> {
                                user.updateRefreshToken(null);
                                usersRepository.save(user);
                            });
                }
            } catch (Exception e) {
                // 토큰 파싱 에러 등이 발생해도 로그아웃(쿠키 삭제)은 진행되어야 함
                log.error("Logout process error: {}", e.getMessage());
            }
        }

        // 2. 쿠키 삭제 (값은 비우고 만료시간은 0으로)
        ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(false) // 변경
                .path("/")
                .sameSite("None") // 프론트와 서버 도메인이 다를 때 필수
                .maxAge(0)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok("Logout successful");
    }
}

