package _team.onmyway.dto;


import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.List;

public record MyPageDTO (
        String username,
        String profileImageURL,
        String catchPhrase,
        Integer follower,
        Integer following,
        List<PostDTO> thumbPosts
) {}
