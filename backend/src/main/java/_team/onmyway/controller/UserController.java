package _team.onmyway.controller;

import _team.onmyway.entity.Users;
import _team.onmyway.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UsersRepository usersRepository;

    @GetMapping("/me")
    public ResponseEntity<?> getMe(Authentication authentication) {

        Long userId = Long.parseLong(authentication.getName());

        Users user = usersRepository.findById(userId)
                .orElseThrow();

        return ResponseEntity.ok(
                Map.of(
                        "id", user.getId(),
                        "role", user.getRole()
                )
        );
    }
}