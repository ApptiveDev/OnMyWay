package _team.onmyway.dto.response;


import java.util.List;

public record MyPageDTO (
        String username,
        String profileImageURL,
        String catchPhrase,
        Integer follower,
        Integer following,
        List<PostDTO> thumbPosts
) {}
