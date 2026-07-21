package _team.onmyway.repository;

import _team.onmyway.entity.user.Profile;
import _team.onmyway.entity.user.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {
    @Query("select p from Profile p join fetch p.user where p.user=:user")
    public Optional<Profile> findByUsers(Users user);
}
