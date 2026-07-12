package _team.onmyway.service;

import _team.onmyway.dto.RecentPlaceDTO;
import _team.onmyway.entity.Place;
import _team.onmyway.repository.PlaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.View;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecentService {

    private final StringRedisTemplate stringRedisTemplate;
    private final PlaceRepository placeRepository;
    private final ImageService imageService;
    private final GeoDistanceService geoDistanceService;

    private static final String GLOBAL = "global";
    private static final String USER_PREFIX = "user:%d:recent";
    private static final int MAX_LIMIT = 10; // 최근 본 곳 유지 개수
    private final StringRedisTemplate redisTemplate;
    private final View view;

    public void setRecentPlaces(Long placeId, Long userId) {
        String targetKey;

        if (userId == null) {
            targetKey = GLOBAL;
        } else {
            targetKey = String.format(USER_PREFIX, userId);
        }

        double timeStamp = System.currentTimeMillis();

        stringRedisTemplate.opsForZSet().add(targetKey, String.valueOf(placeId), timeStamp);

        Long size = stringRedisTemplate.opsForZSet().size(targetKey);
        if (size != null && size > MAX_LIMIT) {
            redisTemplate.opsForZSet().removeRange(targetKey, 0, size - MAX_LIMIT);
        }
    }

    public Mono<List<RecentPlaceDTO>> RecentPlaces(Long userId, Double latitude, Double longitude) {

        LinkedHashMap<Long, Long> placeIdsandTime = getRecentPlaces(userId);

        if (placeIdsandTime.isEmpty()) {
            return Mono.just(Collections.emptyList());
        }

        Set<Long> placeIds = placeIdsandTime.keySet();
        return Mono.fromSupplier(() -> placeRepository.findAllByIdWithCategory(placeIds))
                .subscribeOn(Schedulers.boundedElastic())
                .map(places -> places.stream()
                        .collect(Collectors.toMap(Place::getId, place -> place)))
                .flatMap(placeMap -> Flux.fromIterable(placeIds)
                        .map(placeMap::get)
                        .filter(Objects::nonNull)
                        .flatMapSequential(placeEntity -> {
                            int elapsed = (int) (System.currentTimeMillis() - placeIdsandTime.get(placeEntity.getId()))/60000;
                            double placeLat = placeEntity.getLat();
                            double placeLng = placeEntity.getLng();

                            int minutes = geoDistanceService.estimateWalkingMinutes(geoDistanceService.distanceMeters(
                                    placeLat,placeLng, latitude, longitude
                            ));
                            return imageService.getImageURL(placeEntity)
                                    .map(images -> new RecentPlaceDTO(
                                            placeEntity.getId(),
                                            placeEntity.getName(),
                                            placeEntity.getServiceCategory().getName(),
                                            elapsed,
                                            images,
                                            placeEntity.getCatchPhrase(),
                                            placeLat,
                                            placeLng,
                                            minutes
                                    ));
                        })
                        .collectList()
                );
    }

    public LinkedHashMap<Long, Long> getRecentPlaces(Long userId) {
        String targetKey = (userId == null) ? GLOBAL : String.format(USER_PREFIX, userId);

        Set<ZSetOperations.TypedTuple<String>> placeIds = redisTemplate.opsForZSet().reverseRangeWithScores(targetKey, 0, MAX_LIMIT-1);

        System.out.println(targetKey);
        if (placeIds == null || placeIds.isEmpty()) {
            System.out.println("No places found");
            return new LinkedHashMap<>();
        }

        LinkedHashMap<Long, Long> placeIdandTime = new LinkedHashMap<>();
        for (ZSetOperations.TypedTuple<String> tuple : placeIds) {
            Long placeId = Long.parseLong(String.valueOf(tuple.getValue()));
            Long view = tuple.getScore().longValue();
            placeIdandTime.put(placeId, view);
        }
        return placeIdandTime;
    }
}
