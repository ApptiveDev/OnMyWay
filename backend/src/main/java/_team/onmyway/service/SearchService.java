package _team.onmyway.service;

import _team.onmyway.dto.PlaceRecommendationDTO;
import _team.onmyway.dto.PointDTO;
import _team.onmyway.dto.PositionDTO;
import _team.onmyway.dto.SearchPlaceResultDTO;
import _team.onmyway.entity.HashtagMapping;
import _team.onmyway.entity.Place;
import _team.onmyway.exception.NoPlacesException;
import _team.onmyway.repository.PlaceRepository;
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
import reactor.core.scheduler.Scheduler;
import reactor.core.scheduler.Schedulers;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SearchService {

    private final GeoDistanceService geoDistanceService;
    private final PlaceRepository placeRepository;
    private final ImageService imageService;

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

                allPlaces.sort((a,b) -> Double.compare(
                        geoDistanceService.distanceMeters(a.getLatitude(), a.getLongitude(), position.getLat(), position.getLon()),
                        geoDistanceService.distanceMeters(b.getLatitude(), b.getLongitude(), position.getLat(), position.getLon())
                ));
                return allPlaces;
            } catch (JsonProcessingException e) {
                e.printStackTrace();
                return null;
            }
        });
        return document;
    }

    public Mono<List<SearchPlaceResultDTO>> searchPlaceResult(String query, PositionDTO position) {
        int day = LocalDate.now().getDayOfWeek().getValue()%7;

        return Mono.fromCallable(() -> placeRepository.findByNameContaining(query))
                .subscribeOn(Schedulers.boundedElastic())
                .flatMapMany(Flux::fromIterable)
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
                                    hashtags
                            ));
                })
                .subscribeOn(Schedulers.boundedElastic())
                .collectList();
    }
}
