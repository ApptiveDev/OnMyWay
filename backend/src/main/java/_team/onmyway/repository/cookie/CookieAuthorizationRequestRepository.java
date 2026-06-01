package _team.onmyway.repository.cookie;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.web.AuthorizationRequestRepository;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.SerializationUtils;
import org.springframework.web.util.WebUtils;

import java.util.Base64;

@Slf4j
@Component
public class CookieAuthorizationRequestRepository implements AuthorizationRequestRepository<OAuth2AuthorizationRequest> {
    public static final String OAUTH2_AUTHORIZATION_REQUEST_COOKIE_NAME = "oauth2_auth_request";
    public static final String REDIRECT_URI = "redirect-uri";
    public static final String DEFAULT_URI = "/"; // 기본 화면으로 돌아가기. 테스트 사이트에서는 루트로 바꿔야 함.
    private static final int COOKIE_EXPIRE_SECONDS = 180;

    @Override
    public OAuth2AuthorizationRequest loadAuthorizationRequest(HttpServletRequest request) {
        Cookie cookie = WebUtils.getCookie(request, OAUTH2_AUTHORIZATION_REQUEST_COOKIE_NAME);
        if (cookie != null) {
            return deserialize(cookie.getValue(), OAuth2AuthorizationRequest.class);
        }
        return null;
    }

    @Override
    public void saveAuthorizationRequest(OAuth2AuthorizationRequest authorizationRequest, HttpServletRequest request, HttpServletResponse response) {
        if (authorizationRequest == null) {
            removeAuthorizationRequest(request, response);
            return;
        }

        String encodedAuthRequest = serialize(authorizationRequest);
        Cookie authCookie = new Cookie(OAUTH2_AUTHORIZATION_REQUEST_COOKIE_NAME, encodedAuthRequest);
        authCookie.setPath("/");
        authCookie.setHttpOnly(true);
        authCookie.setMaxAge(COOKIE_EXPIRE_SECONDS);
        response.addCookie(authCookie);

        String redirectUirAfterLogin = request.getParameter(REDIRECT_URI);
        log.info(request.getRequestURI(), redirectUirAfterLogin);

        if (redirectUirAfterLogin == null || redirectUirAfterLogin.isBlank()) {
            redirectUirAfterLogin = DEFAULT_URI;
        }

        Cookie redirectCookie = new Cookie(REDIRECT_URI, redirectUirAfterLogin);
        redirectCookie.setPath("/");
        redirectCookie.setHttpOnly(true);
        redirectCookie.setMaxAge(COOKIE_EXPIRE_SECONDS);
        response.addCookie(redirectCookie);
    }

    @Override
    public OAuth2AuthorizationRequest removeAuthorizationRequest(HttpServletRequest request, HttpServletResponse response) {
        return this.loadAuthorizationRequest(request);
    }

    public void removeAuthorizationCookies(HttpServletRequest request, HttpServletResponse response) {
        deleteCookie(request, response, OAUTH2_AUTHORIZATION_REQUEST_COOKIE_NAME);
        deleteCookie(request, response, REDIRECT_URI);
    }

    private void deleteCookie(HttpServletRequest request, HttpServletResponse response, String cookieName) {
        Cookie cookie = WebUtils.getCookie(request, cookieName);
        if (cookie != null) {
            cookie.setValue("");
            cookie.setPath("/");
            cookie.setMaxAge(0);
            response.addCookie(cookie);
        }
    }

    private String serialize(Object object) {
        return Base64.getUrlEncoder().encodeToString(SerializationUtils.serialize(object));
    }

    private <T> T deserialize(String serialized, Class<T> cls) {
        byte[] decoded = Base64.getUrlDecoder().decode(serialized);
        return cls.cast(SerializationUtils.deserialize(decoded));
    }
}
