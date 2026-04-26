package _team.onmyway.repository;

import _team.onmyway.entity.Place;
import _team.onmyway.entity.ServiceCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PlaceRepository extends JpaRepository<Place, Long> {

    @Query(value = """
        SELECT * FROM place p
        WHERE p.lat BETWEEN :latMin AND :latMax
        AND p.lng BETWEEN :lngMin AND :lngMax
        AND p.service_category_id = :#{#category.id}
        ORDER BY RANDOM()
        LIMIT :limit
        """, nativeQuery = true)
    List<Place> findRandomByCategory(
            double latMin,
            double latMax,
            double lngMin,
            double lngMax,
            ServiceCategory category,
            int limit
    );

    public List<Place> findByAddressAndName(String address, String name);
}