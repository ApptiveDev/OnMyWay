package _team.onmyway.repository;

import _team.onmyway.entity.post.Posts;
import _team.onmyway.entity.user.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostsRepository extends JpaRepository<Posts, Long> {
    @Query("select p from Posts p join fetch p.author where p.author=:user order by p.modified desc")
    public List<Posts> findByUsers(Users user);
}
