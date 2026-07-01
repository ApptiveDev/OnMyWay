package _team.onmyway.config;

import _team.onmyway.repository.cookie.CookieAuthorizationRequestRepository;
import _team.onmyway.security.OAuthFailureHandler;
import _team.onmyway.security.OAuthSuccessHandler;
import _team.onmyway.security.JwtAuthenticationFilter;
import _team.onmyway.service.CustomOAuthUserService;
import jakarta.servlet.DispatcherType;
import lombok.RequiredArgsConstructor;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@EnableWebSecurity
@Configuration
@RequiredArgsConstructor
public class SecurityConfig {
    
    private final CustomOAuthUserService customOAuthUserService;
    private final OAuthSuccessHandler successHandler;
    private final OAuthFailureHandler failureHandler;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CookieAuthorizationRequestRepository cookieRepository;

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(authorizeRequests -> authorizeRequests
                        .dispatcherTypeMatchers(DispatcherType.FORWARD, DispatcherType.INCLUDE).permitAll()
                                .requestMatchers(
                                        "/",
                                        "/find-route",
                                        "/index.html",
                                        "/assets/**",
                                        "/login",
                                        "/error",
                                        "/oauth2/authorization/**",
                                        "/login/oauth2/code/**",
                                        "/api/auth/**",
                                        "/swagger-ui/**",
                                        "/v3/api-docs/**",
                                        "/places/**",
                                        "/route/**"
                                ).permitAll() // 요청을 보낸 이가 누구이든 상관없이 통과되는 URL.
                                .requestMatchers( "/css/**", "/js/**", "/images/**").permitAll()
                                .anyRequest().authenticated()
                )
                .csrf(csrf -> csrf.disable())
                .httpBasic(httpBasic -> httpBasic.disable())
                .formLogin(formLogin -> formLogin.disable())
                .logout(logout -> logout.disable())
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .oauth2Login(oauth -> oauth
                        // oauth2를 이용할 때 로그인 시 사용할 로그인 페이지 지정(Custom)
                        .loginPage("/login")
                        .authorizationEndpoint(authEndpoint -> authEndpoint.authorizationRequestRepository(cookieRepository))
                        .userInfoEndpoint(userInfoEndpoint -> userInfoEndpoint.userService(customOAuthUserService)) // 사용자 정보 이용(회원가입 등)
                        .successHandler(successHandler) // 로그인 완료 시 이동할 곳
                        .failureHandler(failureHandler) // 로그인 실패 시 이동할 곳
                );

        // JWT Filter 등록
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.addAllowedOrigin("http://localhost:3000");
        configuration.addAllowedOrigin("http://localhost:5173"); // Vite 기본 포트
        configuration.addAllowedMethod("*");
        configuration.addAllowedHeader("*");
        configuration.setAllowCredentials(true); // 쿠키 사용(JWT refresh)

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return webSecurity -> {
            webSecurity.ignoring()
                    .requestMatchers("/assets/**");
        };
    }
}
