package _team.onmyway.repository.place;

import _team.onmyway.entity.place.Photos;
import _team.onmyway.entity.place.Place;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PhotosRepository extends JpaRepository<Photos, Long> {
    boolean existsByPlaceId(Long placeId);

    Optional<Photos> findFirstByPlaceId(Long placeId);
    public List<Photos> findByPlace(Place place);
}
