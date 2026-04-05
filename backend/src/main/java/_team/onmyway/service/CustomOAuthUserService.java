package _team.onmyway.service;

import _team.onmyway.entity.OAuthAccounts;
import _team.onmyway.entity.Users;
import _team.onmyway.repository.OAuthAccountsRepository;
import _team.onmyway.repository.UsersRepository;
import _team.onmyway.security.CustomOAuth2User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CustomOAuthUserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UsersRepository usersRepository;
    private final OAuthAccountsRepository oauthAccountsRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate = new DefaultOAuth2UserService();
        // Provider name
        String provider = userRequest.getClientRegistration().getClientName();
        OAuth2User oAuth2User = delegate.loadUser(userRequest);

        Users user = null;

        if ("kakao".equalsIgnoreCase(provider)) {
            user = kakao(oAuth2User.getAttributes());
        }

        return new CustomOAuth2User(oAuth2User, user);
    }

    @Transactional
    public Users kakao(Map<String, Object> userInfos) {
        String providerId = String.valueOf(userInfos.get("id"));
        Map<String, Object> account = (Map<String, Object>) userInfos.get("kakao_account");
        Map<String, Object> profile = (Map<String, Object>) account.get("profile");
        String nickname = (String) profile.get("nickname");

        String email = null;
        Boolean emailValid = (Boolean) account.get("is_email_valid");
        Boolean emailVerified = (Boolean) account.get("is_email_verified");
        if (Boolean.TRUE.equals(emailVerified) && Boolean.TRUE.equals(emailValid)) {
            email = (String) account.get("email");
        }

        String imageURL = null;
        Boolean imageNeedsAgreement = (Boolean) account.get("profile_image_needs_agreement");
        Boolean defaultImage = (Boolean) profile.get("is_default_image");
        if (!Boolean.TRUE.equals(imageNeedsAgreement) && !Boolean.TRUE.equals(defaultImage)) {
            imageURL = (String) profile.get("profile_image_url");
        }

        // DB 조회: OAuthAccounts 존재 여부 확인
        OAuthAccounts accounts = oauthAccountsRepository.findByProviderAndProviderUserId(OAuthAccounts.Provider.KAKAO, providerId);

        Users user;
        if (accounts == null) {
            // 신규 사용자 생성
            user = Users.builder()
                    .nickname(nickname)
                    .email(email)
                    .profileImageUrl(imageURL)
                    .role(Users.Role.USER) // Enum 적용
                    // isActive: Builder.Default(true) 적용
                    // createdAt / updatedAt: @CreationTimestamp / @UpdateTimestamp 자동 관리
                    .build();
            usersRepository.save(user);
            // OAuth 계정 연결 생성
            oauthAccountsRepository.save(new OAuthAccounts(user, OAuthAccounts.Provider.KAKAO, providerId));
        } else {
            // 기존 사용자 정보 업데이트
            user = accounts.getUser();
            user.updateProfile(nickname, email, imageURL);
            usersRepository.save(user);
        }

        return user;
    }
}
