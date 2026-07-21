package _team.onmyway.repository.hashtag;

import _team.onmyway.entity.hashtag.HashTags;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HashtagRepository extends JpaRepository<HashTags, Integer> {
    boolean existsByTag(String hashTag);

    @Query("select h.tag from HashTags h order by h.totalCount desc")
    List<String> findTop10Tags(Pageable pageable);
}
