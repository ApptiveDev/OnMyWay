package _team.onmyway.service;

import _team.onmyway.dto.*;
import _team.onmyway.entity.Place;
import _team.onmyway.entity.ServiceCategory;
import _team.onmyway.entity.WorkingTime;
import _team.onmyway.repository.PlaceRepository;
import _team.onmyway.repository.ServiceCategoryRepository;
import _team.onmyway.repository.WorkingTimeRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@Slf4j
@RequiredArgsConstructor
public class RecommendationService {

    private final PlaceRepository placeRepository;
    private final ServiceCategoryRepository serviceCategoryRepository;
    private final GeoDistanceService geoDistanceService;
    private final WorkingTimeRepository workingTimeRepository;

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

    public AllCategoryRecommendationsDTO recommendByRoute(RouteResponseDTO routeResponse, double userLat, double userLng) {
        // 1. T-map 응답에서 모든 경로 좌표 추출
        List<PositionDTO> allPoints = extractRoutePoints(routeResponse);
        // 2. 경로의 총 거리에 비례하여 약 150m 간격으로 샘플링
        List<PositionDTO> sampledPoints = samplePointsByDistance(allPoints, 150.0);

        if (sampledPoints.isEmpty()) return new AllCategoryRecommendationsDTO(Collections.emptyList());

        // 3. 전체 경로를 포함하는 거대 Bounding Box 계산 (1차 필터링용)
        double minLat = sampledPoints.stream().mapToDouble(PositionDTO::getLat).min().orElse(0.0);
        double maxLat = sampledPoints.stream().mapToDouble(PositionDTO::getLat).max().orElse(0.0);
        double minLng = sampledPoints.stream().mapToDouble(PositionDTO::getLon).min().orElse(0.0);
        double maxLng = sampledPoints.stream().mapToDouble(PositionDTO::getLon).max().orElse(0.0);

        // 검색 범위를 100m 정도 더 확장 (가장자리 장소 누락 방지)
        double marginLat = 100.0 / METERS_PER_DEGREE;
        double marginLng = 100.0 / (METERS_PER_DEGREE * Math.cos(Math.toRadians(minLat)));

        // 4. DB에서 후보군 대량 조회 (1차 필터링)
        List<Place> candidates = placeRepository.findByBoundingBox(
                SUPPORTED_CATEGORY_IDS,
                minLat - marginLat, maxLat + marginLat,
                minLng - marginLng, maxLng + marginLng
        );

        // 5. Java에서 정밀 필터링 (2차 필터링: 각 샘플 점 기준 100m 이내인지 확인)
        double searchRadiusMeters = 100.0;
        List<Place> filteredPlaces = candidates.stream()
                .filter(place -> isPlaceNearAnySamplePoint(place, sampledPoints, searchRadiusMeters))
                .toList();

        // 6. 카테고리별 그룹화 및 랜덤 추출 (동일)
        Map<Long, List<Place>> groupedByCategoryId = filteredPlaces.stream()
                .collect(Collectors.groupingBy(p -> p.getServiceCategory().getId()));

        List<CategoryRecommendationDTO> categoryDTOs = SUPPORTED_CATEGORY_IDS.stream()
                .map(categoryId -> {
                    ServiceCategory category = serviceCategoryRepository.findById(categoryId).orElseThrow();
                    List<Place> categoryPlaces = new ArrayList<>(groupedByCategoryId.getOrDefault(categoryId, Collections.emptyList()));

                    Collections.shuffle(categoryPlaces);
                    int day = LocalDate.now().getDayOfWeek().getValue();
                    List<PlaceRecommendationDTO> placeInfos = categoryPlaces.stream()
                            .limit(DEFAULT_LIMIT_PER_CATEGORY)
                            .map(p -> {
                                List<WorkingTime> placeWorkingTime = workingTimeRepository.findByPlace(p);
                                WorkingTime workingTime = placeWorkingTime.get(day%7);
                                return toPlaceRecommendationDTO(p, userLat, userLng, workingTime.isClosed(), workingTime.getOpenTime(), workingTime.getCloseTime());
                            })
                            .toList();

                    PlaceRecommendationDTO featured = placeInfos.isEmpty() ? null : placeInfos.get(0);
                    return new CategoryRecommendationDTO(categoryId, category.getName(), placeInfos, featured);
                })
                .toList();

        return new AllCategoryRecommendationsDTO(categoryDTOs);
    }

    private boolean isPlaceNearAnySamplePoint(Place place, List<PositionDTO> samples, double radiusMeters) {
        double deltaLat = radiusMeters / METERS_PER_DEGREE;

        for (int i = 0; i < samples.size(); i++) {
            PositionDTO sample = samples.get(i);
            double cosLat = Math.cos(Math.toRadians(sample.getLat()));
            double deltaLng = radiusMeters / (METERS_PER_DEGREE * cosLat);

            // 1. 일단 기본 100m x 100m 사각형 안에 들어오는지 확인
            boolean inBasicBox = place.getLat() >= sample.getLat() - deltaLat &&
                                 place.getLat() <= sample.getLat() + deltaLat &&
                                 place.getLng() >= sample.getLon() - deltaLng &&
                                 place.getLng() <= sample.getLon() + deltaLng;

            if (inBasicBox) {
                // 2. 출발지(i=0)일 경우: 경로가 진행되는 방향의 반쪽만 허용
                if (i == 0 && samples.size() > 1) {
                    PositionDTO next = samples.get(1);
                    if (isOppositeDirection(sample, next, place)) continue;
                }
                // 3. 목적지(i=last)일 경우: 경로가 들어오는 방향의 반쪽만 허용
                else if (i == samples.size() - 1 && i > 0) {
                    PositionDTO prev = samples.get(i - 1);
                    if (isOppositeDirection(sample, prev, place)) continue;
                }

                // 모든 검사를 통과하면 유효한 장소!
                return true;
            }
        }
        return false;
    }

    /**
     * 기준점(base)에서 목표점(target)으로 가는 방향의 '반대편'에 장소가 있는지 체크
     */
    private boolean isOppositeDirection(PositionDTO base, PositionDTO target, Place place) {
        // 위도 방향 체크: 경로가 북쪽으로 가는데 장소가 남쪽에 있다면?
        if (target.getLat() > base.getLat() && place.getLat() < base.getLat()) return true;
        if (target.getLat() < base.getLat() && place.getLat() > base.getLat()) return true;

        // 경도 방향 체크: 경로가 동쪽으로 가는데 장소가 서쪽에 있다면?
        if (target.getLon() > base.getLon() && place.getLng() < base.getLon()) return true;
        if (target.getLon() < base.getLon() && place.getLng() > base.getLon()) return true;

        return false;
    }

    private List<PositionDTO> samplePointsByDistance(List<PositionDTO> points, double distanceMeters) {
        if (points.isEmpty()) return Collections.emptyList();

        List<PositionDTO> sampled = new ArrayList<>();
        sampled.add(points.get(0));

        PositionDTO lastSampled = points.get(0);
        for (int i = 1; i < points.size(); i++) {
            PositionDTO current = points.get(i);
            double dist = geoDistanceService.distanceMeters(lastSampled.getLat(), lastSampled.getLon(), current.getLat(), current.getLon());

            if (dist >= distanceMeters) {
                sampled.add(current);
                lastSampled = current;
            }
        }

        // 마지막 점 추가 (누락 방지)
        if (points.size() > 1 && !sampled.contains(points.get(points.size()-1))) {
            sampled.add(points.get(points.size()-1));
        }

        return sampled;
    }

    private List<PositionDTO> extractRoutePoints(RouteResponseDTO response) {
        List<PositionDTO> points = new ArrayList<>();
        if (response.getFeatures() != null) {
            for (RouteResponseDTO.FeatureDTO feature : response.getFeatures()) {
                if (feature.getGeometry() != null && "LineString".equals(feature.getGeometry().getType())) {
                    Object coordinates = feature.getGeometry().getCoordinates();
                    if (coordinates instanceof List) {
                        for (Object coordObj : (List<?>) coordinates) {
                            if (coordObj instanceof List) {
                                List<Double> coord = (List<Double>) coordObj;
                                points.add(new PositionDTO(coord.get(1), coord.get(0)));
                            }
                        }
                    }
                }
            }
        }
        return points;
    }


    private CategoryRecommendationDTO recommendSingleCategory(double lat, double lng, Long categoryId) {
        ServiceCategory category = serviceCategoryRepository.findById(categoryId)
                .orElseThrow();
        List<Place> places = getPlacesInRadius(lat, lng, categoryId, DEFAULT_LIMIT_PER_CATEGORY);

        int day = LocalDate.now().getDayOfWeek().getValue();
        List<PlaceRecommendationDTO> placeInfos = places.stream()
                .map(place -> {
                    List<WorkingTime> placeWorkingTime = workingTimeRepository.findByPlace(place);
                    WorkingTime workingTime = placeWorkingTime.get(day%7);
                    return toPlaceRecommendationDTO(place, lat, lng, workingTime.isClosed(), workingTime.getOpenTime(), workingTime.getCloseTime());
                })
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

    private PlaceRecommendationDTO toPlaceRecommendationDTO(Place place, double userLat, double userLng, boolean isClosed, LocalTime open, LocalTime close) {
        double distance = geoDistanceService.distanceMeters(userLat, userLng, place.getLat(), place.getLng());
        int walkingMinutes = geoDistanceService.estimateWalkingMinutes(distance);
        return new PlaceRecommendationDTO(
                place.getName(),
                place.getLat(),
                place.getLng(),
                place.getServiceCategory().getName(),
                walkingMinutes,
                open,
                close,
                isOpen(isClosed, open, close)
        );
    }

    private boolean isOpen(boolean isClosed, LocalTime open, LocalTime close) {
        LocalTime now = LocalTime.now();
        if (isClosed) {
            return false;
        } else if (open == null || close == null) {
            return true;
        } else if (open.equals(close)) {
            return true;
        } else if (open.isBefore(close)) {
            if (now.isAfter(open) && now.isBefore(close)) {
                return true;
            } else {
                return false;
            }
        } else {
            LocalDate openDay = LocalDate.now();
            LocalDate closeDay = LocalDate.now().plusDays(1);
            LocalDate nowDay = LocalDate.now();
            if (open.isAfter(now) && nowDay.equals(closeDay) || now.isAfter(open) && nowDay.equals(openDay)) {
                return true;
            } else {
                return false;
            }
        }
    }
}