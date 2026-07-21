package _team.onmyway.service.search;

import _team.onmyway.dto.response.PointDTO;
import _team.onmyway.dto.response.PositionDTO;
import _team.onmyway.dto.response.SearchPlaceResultDTO;
import _team.onmyway.entity.place.Place;
import _team.onmyway.repository.user.LikePlaceRepository;
import _team.onmyway.repository.place.PlaceRepository;
import _team.onmyway.service.place.ImageService;
import _team.onmyway.service.distance.GeoDistanceService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SearchService {

    private final GeoDistanceService geoDistanceService;
    private final PlaceRepository placeRepository;
    private final ImageService imageService;
    private final LikePlaceRepository likePlaceRepository;

    @Value("${KAKAO_CLIENT_ID}")
    private String apiKey;

    public Mono<List<PointDTO>> searchPlaces(String query, PositionDTO position) {
        ObjectMapper mapper = new ObjectMapper();

        WebClient webClient = WebClient.builder() // 카카오 API로 출발지/목적지 검색
                .baseUrl("https://dapi.kakao.com/v2/local/search/keyword.json")
                .defaultHeader(HttpHeaders.AUTHORIZATION, "KakaoAK "+apiKey)
                .build();

        Mono<String> resp = webClient.get()
                .uri(uribuilder -> uribuilder
                        .queryParam("query", query) // 검색어 추가
                        .queryParam("x", position.getLon())
                        .queryParam("y", position.getLat())
                        .build())
                .retrieve()
                .bodyToMono(String.class);

        Mono<List<PointDTO>> document = resp.map(str -> {
            try {
                JsonNode node = mapper.readTree(str).get("documents");
                // 예외 상황 1 : node에서 아무것도 나오지 않음
                List<PointDTO> allPlaces = new ArrayList<>();

                List<PointDTO> directPlaces = new ArrayList<>();
                List<PointDTO> nearbyPlaces = new ArrayList<>();
                if (node.isArray()) {
                    for (JsonNode place : node) {
                        String name = place.get("place_name").asText();
                        Double lat = place.get("x").asDouble();
                        Double lng = place.get("y").asDouble();
                        String address = place.get("address_name").asText();
                        String roadAddress = place.get("road_address_name").asText();

                        if (name.contains(query)) directPlaces.add(new PointDTO(name, lat, lng, address, roadAddress));
                        else nearbyPlaces.add(new PointDTO(name, lat, lng, address, roadAddress));
                    }
                }

                if (directPlaces.size() < 4) allPlaces.addAll(directPlaces);
                else allPlaces.addAll(directPlaces.subList(0, 3));

                if (nearbyPlaces.size() < 3) allPlaces.addAll(nearbyPlaces);
                else allPlaces.addAll(nearbyPlaces.subList(0, 2));

//                allPlaces.sort((a,b) -> Double.compare(
//                        distanceService.distance(a.getLatitude(), a.getLongitude(), position.getLat(), position.getLon()),
//                        distanceService.distance(b.getLatitude(), b.getLongitude(), position.getLat(), position.getLon())
//                ));
                return allPlaces;
            } catch (JsonProcessingException e) {
                e.printStackTrace();
                return null;
            }
        });
        return document;
    }

    public Mono<List<SearchPlaceResultDTO>> searchPlaceResult(String query, PositionDTO position, Long userId) {
        int day = LocalDate.now().getDayOfWeek().getValue()%7;

        Mono<Set<Long>> likedPlaceIds = Mono.fromCallable(() -> {
            if (userId == null) return Collections.emptySet();

            List<Place> likePlaces = likePlaceRepository.findPlaceByUsersId(userId);
            return likePlaces.stream()
                    .map(Place::getId)
                    .collect(Collectors.toSet());
        });

        Mono<List<Place>> placesMono = Mono.fromCallable(() -> placeRepository.findByNameContaining(query))
                .subscribeOn(Schedulers.boundedElastic());

        return Mono.zip(placesMono, likedPlaceIds)
                .flatMapMany(tuple -> {
                    List<Place> places = tuple.getT1();
                    Set<Long> placeIds = tuple.getT2();

                    return Flux.fromIterable(places)
                            .flatMap(place -> {
                                Double distance = geoDistanceService.distanceMeters(
                                        place.getLat(), place.getLng(), position.getLat(), position.getLon()
                                );

                                List<String> hashtags = place.getHashtagMappings()
                                        .stream()
                                        .map(hashtagMapping -> {
                                            return hashtagMapping.getHashTag().getTag();
                                        })
                                        .collect(Collectors.toList());

                                boolean isLiked = placeIds.contains(place.getId());

                                return imageService.getImageURL(place)
                                        .map(images -> new SearchPlaceResultDTO(
                                                place.getId(),
                                                place.getName(),
                                                place.getLat(),
                                                place.getLng(),
                                                distance,
                                                place.getServiceCategory().getName(),
                                                images,
                                                place.getWorkingTimes().get(day).isClosed(),
                                                hashtags,
                                                isLiked
                                        ));
                            });

                })
                .subscribeOn(Schedulers.boundedElastic())
                .collectList();
    }
}
