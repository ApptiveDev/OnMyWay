package _team.onmyway.service;

import _team.onmyway.entity.OAuthAccounts;
import _team.onmyway.entity.Users;
import _team.onmyway.repository.OAuthAccountsRepository;
import _team.onmyway.repository.UsersRepository;
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
        if (provider.equals("kakao")) kakao(provider, oAuth2User.getAttributes()); // getAttributes : User 정보를 어떤 걸 가지고 왔는지 표시
        return oAuth2User;
    }

    @Transactional
    public void kakao(String provider, Map<String, Object> userInfos) {
        String providerId = String.valueOf(userInfos.get("id"));
        Map<String, Object> account = (Map<String, Object>)userInfos.get("kakao_account");
        Map<String, Object> profile = (Map<String, Object>)account.get("profile");
        String nickname = (String) profile.get("nickname");

        String email = null;
        Boolean emailValid = (Boolean)account.get("is_email_valid");
        Boolean emailVerified = (Boolean)account.get("is_email_verified");
        if (emailVerified && emailValid) email = (String)account.get("email");

        String imageURL = null;
        Boolean imageNeedsAgreement = (Boolean)account.get("profile_image_needs_agreement");
        Boolean defaultImage = (Boolean)profile.get("is_default_image");
        if (!imageNeedsAgreement && !defaultImage) imageURL = (String)profile.get("profile_image_url");

        if (oauthAccountsRepository.findByProviderAndProviderUserId(provider, providerId) == null) {
            Users newUser = new Users().builder()
                    .nickname(nickname)
                    .email(email)
                    .profileImageUrl(imageURL)
                    .role("ROLE_USER")
                    .createdAt(LocalDateTime.now())
                    .isActive(true)
                    .build();

            usersRepository.save(newUser);
            oauthAccountsRepository.save(new OAuthAccounts(newUser, provider, providerId));
        } else {
            OAuthAccounts accounts = oauthAccountsRepository.findByProviderAndProviderUserId(provider, providerId);
            Users getUser = accounts.getUser();

            getUser.updateUser(nickname, email, imageURL);
            usersRepository.save(getUser);
        }
    }
}
