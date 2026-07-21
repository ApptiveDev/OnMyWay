package _team.onmyway.repository.place;

import _team.onmyway.entity.place.HashtagMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HashtagMappingRepository extends JpaRepository<HashtagMapping, Integer> {
    @Query("select h.hashTag.tag from HashtagMapping h join h.hashTag where h.place.id =:placeId")
    public List<String> findHashtagByPlaceId(Long placeId);
}
