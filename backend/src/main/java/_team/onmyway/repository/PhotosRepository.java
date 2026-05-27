package _team.onmyway.repository;

import _team.onmyway.entity.Photos;
import _team.onmyway.entity.Place;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PhotosRepository extends JpaRepository<Photos, Long> {
    public List<Photos> findByPlace(Place place);
}
