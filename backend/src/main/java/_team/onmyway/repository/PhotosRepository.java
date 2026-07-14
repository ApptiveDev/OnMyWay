package _team.onmyway.repository;

import _team.onmyway.entity.Photos;
import _team.onmyway.entity.Place;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface PhotosRepository extends JpaRepository<Photos, Long> {
    boolean existsByPlaceId(Long placeId);

    Optional<Photos> findFirstByPlaceId(Long placeId);
    public List<Photos> findByPlace(Place place);
}
