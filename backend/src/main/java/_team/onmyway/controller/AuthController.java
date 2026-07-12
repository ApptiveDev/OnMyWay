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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final JwtService jwtService;
    private final UsersRepository usersRepository;

    @GetMapping("/me")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getCurrentUser(
            @org.springframework.security.core.annotation.AuthenticationPrincipal String userId) {

        if (userId == null || !userId.matches("\\d+")) {
            return ResponseEntity.status(401).body(Map.of("message", "인증 정보가 없습니다."));
        }

        Users user = usersRepository.findById(Long.parseLong(userId))
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        String imageURL = user.getProfile() != null ? user.getProfile().getImageURL() : null;
        String kakaoName = user.getProfile() != null && user.getProfile().getProfileName() != null
                ? user.getProfile().getProfileName()
                : (user.getNickname() != null ? user.getNickname() : "");

        return ResponseEntity.ok(Map.of(
                "nickname", user.getNickname() != null ? user.getNickname() : "",
                "kakaoName", kakaoName,
                "imageURL", imageURL != null ? imageURL : "",
                "status", user.getStatus().name()
        ));
    }

    @PostMapping("/signup/complete")
    @Transactional
    public ResponseEntity<?> completeSignup(
            @RequestBody _team.onmyway.dto.SignupCompleteRequest request,
            @org.springframework.security.core.annotation.AuthenticationPrincipal String userId,
            HttpServletResponse response) {

        if (userId == null || !userId.matches("\\d+")) {
            return ResponseEntity.status(401).body(Map.of("message", "인증 정보가 없습니다."));
        }

        Users user = usersRepository.findById(Long.parseLong(userId))
                .orElse(null);

        if (user == null) {
            return ResponseEntity.status(404).body(Map.of("message", "사용자를 찾을 수 없습니다."));
        }

        if (request.getNickname() == null || !request.getNickname().matches("^[가-힣a-zA-Z0-9]{1,10}$")) {
            return ResponseEntity.status(400).body(Map.of("message", "닉네임은 한글, 영어, 숫자만 사용 가능하며 10자 이하여야 합니다."));
        }

        if (usersRepository.existsByNicknameAndIdNot(request.getNickname(), user.getId())) {
            return ResponseEntity.status(400).body(Map.of("message", "이미 사용 중인 닉네임입니다."));
        }

        user.completeSignup(request.getNickname());
        if (user.getProfile() != null) {
            String imageURL = resolveImageURL(request.getImageURL(), user.getProfile().getImageURL());
            user.getProfile().updateProfile(imageURL, request.getNickname());
        }
        usersRepository.save(user);

        String newAccessToken = jwtService.createAccessToken(user.getId(), user.getRole().name());

        return ResponseEntity.ok(Map.of(
                "accessToken", newAccessToken,
                "message", "회원가입이 완료되었습니다."
        ));
    }

    private String resolveImageURL(String requested, String existing) {
        if (requested != null && (requested.startsWith("http://") || requested.startsWith("https://"))) {
            return requested;
        }
        return existing;
    }

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
                .secure(false)
                .path("/")
                .sameSite("Lax")
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
                .secure(false)
                .path("/")
                .sameSite("Lax")
                .maxAge(0)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok("Logout successful");
    }
}

