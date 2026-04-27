package _team.onmyway.service;

import _team.onmyway.dto.AllCategoryRecommendationsDTO;
import _team.onmyway.dto.CategoryRecommendationDTO;
import _team.onmyway.dto.PlaceRecommendationDTO;
import _team.onmyway.entity.Place;
import _team.onmyway.entity.ServiceCategory;
import _team.onmyway.repository.PlaceRepository;
import _team.onmyway.repository.ServiceCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final PlaceRepository placeRepository;
    private final ServiceCategoryRepository serviceCategoryRepository;
    private final GeoDistanceService geoDistanceService;

    private static final double RADIUS_METERS = 250.0;
    private static final int DEFAULT_LIMIT_PER_CATEGORY = 7;
    private static final double METERS_PER_DEGREE = 111000.0;
    private static final List<Long> SUPPORTED_CATEGORY_IDS = List.of(1L, 2L, 3L, 4L, 5L, 6L);

    public AllCategoryRecommendationsDTO recommend(double lat, double lng) {
        List<CategoryRecommendationDTO> categories = SUPPORTED_CATEGORY_IDS.stream()
                .map(categoryId -> recommendSingleCategory(lat, lng, categoryId))
                .toList();
        return new AllCategoryRecommendationsDTO(categories);
    }

    private CategoryRecommendationDTO recommendSingleCategory(double lat, double lng, Long categoryId) {
        ServiceCategory category = serviceCategoryRepository.findById(categoryId)
                .orElseThrow();
        List<Place> places = getPlacesInRadius(lat, lng, categoryId, DEFAULT_LIMIT_PER_CATEGORY);
        List<PlaceRecommendationDTO> placeInfos = places.stream()
                .map(place -> toPlaceRecommendationDTO(place, lat, lng))
                .toList();
        PlaceRecommendationDTO featured = placeInfos.isEmpty() ? null : placeInfos.get(0);
        return new CategoryRecommendationDTO(categoryId, category.getName(), placeInfos, featured);
    }

    private List<Place> getPlacesInRadius(double lat, double lng, Long categoryId, int limit) {
        ServiceCategory category = serviceCategoryRepository.findById(categoryId)
                .orElseThrow();

        double latDelta = RADIUS_METERS / METERS_PER_DEGREE;
        double cosLat = Math.cos(Math.toRadians(lat));
        double lngDelta = Math.abs(cosLat) < 1e-6
                ? latDelta
                : RADIUS_METERS / (METERS_PER_DEGREE * Math.abs(cosLat));

        double latMin = lat - latDelta;
        double latMax = lat + latDelta;
        double lngMin = lng - lngDelta;
        double lngMax = lng + lngDelta;

        return placeRepository.findRandomByCategoryInRadius(
                lat,
                lng,
                latMin,
                latMax,
                lngMin,
                lngMax,
                RADIUS_METERS,
                category,
                limit
        );
    }

    private PlaceRecommendationDTO toPlaceRecommendationDTO(Place place, double userLat, double userLng) {
        double distance = geoDistanceService.distanceMeters(userLat, userLng, place.getLat(), place.getLng());
        int walkingMinutes = geoDistanceService.estimateWalkingMinutes(distance);
        return new PlaceRecommendationDTO(
                place.getName(),
                place.getLat(),
                place.getLng(),
                place.getServiceCategory().getName(),
                walkingMinutes
        );
    }
}