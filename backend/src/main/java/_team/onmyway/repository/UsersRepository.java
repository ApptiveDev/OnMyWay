package _team.onmyway.repository;

import _team.onmyway.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsersRepository extends JpaRepository<Users, Long> {

    // 이메일로 사용자 조회
    Users findByEmail(String email);

    Users findByRefreshToken(String refreshToken);
    public Users findByid(Long id);
}
