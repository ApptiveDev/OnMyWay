package _team.onmyway.service;

import _team.onmyway.dto.RecommendationResponseDTO;
import _team.onmyway.entity.Place;
import _team.onmyway.entity.ServiceCategory;
import _team.onmyway.repository.PlaceRepository;
import _team.onmyway.repository.ServiceCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final PlaceRepository placeRepository;
    private final ServiceCategoryRepository serviceCategoryRepository;

    private static final double RANGE = 0.005; // 약 500m

    public RecommendationResponseDTO recommend(double lat, double lng) {

        double latMin = lat - RANGE;
        double latMax = lat + RANGE;
        double lngMin = lng - RANGE;
        double lngMax = lng + RANGE;

        List<Place> result = new ArrayList<>();

        // 카테고리별 개수
        result.addAll(getPlaces(latMin, latMax, lngMin, lngMax, 1L, 2)); // 한잔 2
        result.addAll(getPlaces(latMin, latMax, lngMin, lngMax, 2L, 2)); // 한입 2
        result.addAll(getPlaces(latMin, latMax, lngMin, lngMax, 3L, 1)); // 한숨 1
        result.addAll(getPlaces(latMin, latMax, lngMin, lngMax, 4L, 1)); // 한손 1
        result.addAll(getPlaces(latMin, latMax, lngMin, lngMax, 5L, 1)); // 한눈 1

        return RecommendationResponseDTO.from(result, lat, lng);
    }

    public RecommendationResponseDTO recommendByCategory(double lat, double lng, Long categoryId) {

        double latMin = lat - RANGE;
        double latMax = lat + RANGE;
        double lngMin = lng - RANGE;
        double lngMax = lng + RANGE;

        ServiceCategory category = serviceCategoryRepository.findById(categoryId)
                .orElseThrow();

        List<Place> places = placeRepository.findRandomByCategory(
                latMin, latMax, lngMin, lngMax, category, 7
        );

        return RecommendationResponseDTO.from(places, lat, lng);
    }

    private List<Place> getPlaces(double latMin, double latMax,
                                  double lngMin, double lngMax,
                                  Long categoryId, int limit) {

        ServiceCategory category = serviceCategoryRepository.findById(categoryId)
                .orElseThrow();

        return placeRepository.findRandomByCategory(
                latMin, latMax, lngMin, lngMax, category, limit
        );
    }
}