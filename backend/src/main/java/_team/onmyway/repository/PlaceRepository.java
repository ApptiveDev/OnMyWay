package _team.onmyway.repository;

import _team.onmyway.entity.Place;
import _team.onmyway.entity.ServiceCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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
            @Param("centerLat") double centerLat,
            @Param("centerLng") double centerLng,
            @Param("latMin") double latMin,
            @Param("latMax") double latMax,
            @Param("lngMin") double lngMin,
            @Param("lngMax") double lngMax,
            @Param("radiusMeters") double radiusMeters,
            @Param("category") ServiceCategory category,
            @Param("limit") int limit
    );

    @Query(value = """
        SELECT * FROM place p
        WHERE p.service_category_id IN :categoryIds
          AND p.lat BETWEEN :minLat AND :maxLat
          AND p.lng BETWEEN :minLng AND :maxLng
        """, nativeQuery = true)
    List<Place> findByBoundingBox(
            @Param("categoryIds") List<Long> categoryIds,
            @Param("minLat") double minLat,
            @Param("maxLat") double maxLat,
            @Param("minLng") double minLng,
            @Param("maxLng") double maxLng
    );

    public List<Place> findByAddressAndName(String address, String name);
}