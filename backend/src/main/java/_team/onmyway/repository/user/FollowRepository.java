package _team.onmyway.repository.user;

import _team.onmyway.entity.user.Follow;
import _team.onmyway.entity.user.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FollowRepository extends JpaRepository<Follow, Integer> {
    int countByToUser(Users user); // 유저를 팔로잉하는 수
    int countByFromUser(Users user); // 유저가 팔로잉하는 수
}
