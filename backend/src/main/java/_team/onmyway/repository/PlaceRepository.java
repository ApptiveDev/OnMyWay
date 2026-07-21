package _team.onmyway.repository;

import _team.onmyway.entity.place.Place;
import _team.onmyway.entity.category.ServiceCategory;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PlaceRepository extends JpaRepository<Place, Long> {

    @Query(value = """
        SELECT * FROM place p
        WHERE p.service_category_id = :#{#category.id}
          -- 1) 박스 선필터 (인덱스 활용)
          AND p.lat BETWEEN :latMin AND :latMax
          AND p.lng BETWEEN :lngMin AND :lngMax
          -- 2) 원 정밀필터 (미터 단위, Haversine)
          AND (
            6371000 * acos(
              least(1.0, greatest(-1.0,
                cos(radians(:centerLat)) * cos(radians(p.lat)) *
                cos(radians(p.lng) - radians(:centerLng)) +
                sin(radians(:centerLat)) * sin(radians(p.lat))
              ))
            )
          ) <= :radiusMeters
        ORDER BY RANDOM()
        LIMIT :limit
        """, nativeQuery = true)
    List<Place> findRandomByCategoryInRadius(
            double centerLat,
            double centerLng,
            double latMin,
            double latMax,
            double lngMin,
            double lngMax,
            double radiusMeters,
            ServiceCategory category,
            int limit
    );

    @EntityGraph(attributePaths = {"workingTimes", "serviceCategory"})
    // JPQL로 해결
    @Query(value = """
        SELECT p FROM Place p
        WHERE p.serviceCategory.id IN :categoryIds
          AND p.lat BETWEEN :minLat AND :maxLat
          AND p.lng BETWEEN :minLng AND :maxLng
        """)
    List<Place> findByBoundingBox(
            List<Long> categoryIds,
            double minLat,
            double maxLat,
            double minLng,
            double maxLng
    );

    public List<Place> findByAddressAndName(String address, String name);

    @Query("select distinct p from Place p join fetch p.serviceCategory left join fetch p.hashtagMappings hm left join fetch hm.hashTag left join fetch p.workingTimes where p.name like %:name%")
    public List<Place> findByNameContaining(String name);

    public Place findById(long id);
}