package _team.onmyway.repository.user;

import _team.onmyway.entity.user.LikePlace;
import _team.onmyway.entity.place.Place;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LikePlaceRepository extends JpaRepository<LikePlace, Long> {
    @Query("select lp.place from LikePlace lp where lp.user.id=:id")
    public List<Place> findPlaceByUsersId(Long id);
}
