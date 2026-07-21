package _team.onmyway.service.personal;

import _team.onmyway.dto.response.MyPageDTO;
import _team.onmyway.dto.response.PostDTO;
import _team.onmyway.entity.user.Profile;
import _team.onmyway.entity.user.Users;
import _team.onmyway.exception.NotAuthenticationException;
import _team.onmyway.exception.UserNotFoundException;
import _team.onmyway.repository.FollowRepository;
import _team.onmyway.repository.PostsRepository;
import _team.onmyway.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MyPageService {
    private final UsersRepository usersRepository;
    private final PostsRepository postsRepository;
    private final FollowRepository followRepository;

    public MyPageDTO Home() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new NotAuthenticationException("인증된 사용자가 아닙니다. 로그인을 진행해 주세요.");
        }

        String userIdStr = (String) authentication.getPrincipal();
        Long userId = Long.parseLong(userIdStr);
        Users user = usersRepository.findById(userId).orElseThrow(
                () -> new UserNotFoundException("존재하지 않는 사용자입니다.")
        );

        Profile profile = getProfile(user);
        List<PostDTO> posts = getPosts(user);
        MyPageDTO myPageDTO = new MyPageDTO(
                profile.getProfileName(),
                profile.getImageURL(),
                profile.getCatchPhrase(),
                follwer(user),
                following(user),
                posts
        );
        return myPageDTO;
    }

    private List<PostDTO> getPosts(Users user) {
        // 작성한 Post들 가지고 오기(3개만 가지고 오는 건 DB에서 제약을 걸어둠)
        return postsRepository.findByUsers(user).stream()
                .map(PostDTO::fromPost)
                .collect(Collectors.toList());
    }

    private Profile getProfile(Users user) {
        // 마이페이지 프로필 가지고 오기
        // 1:1 양방향 연관관계이므로 User 단에서 Profile을 가지고 올 수 있다.
        return user.getProfile();
    }

    private int follwer(Users user) {
        return followRepository.countByToUser(user);
    }

    private int following(Users user) {
        return followRepository.countByFromUser(user);
    }
}
