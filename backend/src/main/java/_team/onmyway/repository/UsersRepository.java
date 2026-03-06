package _team.onmyway.repository;

import _team.onmyway.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsersRepository extends JpaRepository<Users, Long> {
    public Users findByid(Long id);
}
