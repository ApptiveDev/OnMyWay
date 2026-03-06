package _team.onmyway.security;

import _team.onmyway.handler.CustomFailureHandler;
import _team.onmyway.handler.CustomSuccessHandler;
import _team.onmyway.service.CustomOAuthUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@EnableWebSecurity
@Configuration
@RequiredArgsConstructor
public class SecurityConfig {
    
    private final CustomOAuthUserService customOAuthUserService;
    private final CustomSuccessHandler successHandler;
    private final CustomFailureHandler failureHandler;

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(authorizeRequests -> authorizeRequests
                                .requestMatchers("/oauth2/authorization/**", "/login/oauth2/code/**").permitAll() // 요청을 보낸 이가 누구이든 상관없이 통과되는 URL.
                                .anyRequest().authenticated()
                )
                .csrf(csrf -> csrf.disable())
                .httpBasic(httpBasic -> httpBasic.disable())
                .formLogin(formLogin -> formLogin.disable())
                .logout(logout -> logout.disable())
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .oauth2Login(oauth -> oauth
                        .userInfoEndpoint(userInfoEndpoint -> userInfoEndpoint.userService(customOAuthUserService)) // 사용자 정보 이용(회원가입 등)
                        .successHandler(successHandler) // 로그인 완료 시 이동할 곳
                        .failureHandler(failureHandler) // 로그인 실패 시 이동할 곳
                );

        return http.build();
    }
}
