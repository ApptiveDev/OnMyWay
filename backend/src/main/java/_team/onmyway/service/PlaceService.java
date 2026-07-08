package _team.onmyway.service;

import _team.onmyway.dto.BlogDTO;
import _team.onmyway.dto.PlaceDetailDTO;
import _team.onmyway.entity.Place;
import _team.onmyway.exception.NoPlacesException;
import _team.onmyway.repository.HashtagMappingRepository;
import _team.onmyway.repository.PlaceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Scheduler;
import reactor.core.scheduler.Schedulers;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class PlaceService {

    private final HashtagMappingRepository hashtagMappingRepository;
    private final PlaceRepository placeRepository;
    private final WebClient webClient;

    @Value("${naver.api.clientId}")
    private String naverClientId;

    @Value("${naver.api.clientSecret}")
    private String naverClientSecret;

    public PlaceService(HashtagMappingRepository hashtagMappingRepository, PlaceRepository placeRepository) {
        this.hashtagMappingRepository = hashtagMappingRepository;
        this.placeRepository = placeRepository;
        this.webClient = WebClient.builder().baseUrl("https://openapi.naver.com")
                .build();
    }

    public Mono<PlaceDetailDTO> getHashtags(Long placeId) {

        Mono<Place> placeMono = Mono.fromCallable(() ->
                placeRepository.findById(placeId)
                        .orElseThrow(() -> new NoPlacesException("존재하지 않는 장소입니다"))
        ).subscribeOn(Schedulers.boundedElastic());

        Mono<List<String>> hashtagMappings = Mono.fromCallable(() ->
                hashtagMappingRepository.findHashtagByPlaceId(placeId)
        ).subscribeOn(Schedulers.boundedElastic());

        return Mono.zip(placeMono, hashtagMappings)
                .flatMap(tuple -> {
                    Place place = tuple.getT1();
                    List<String> hashtags = tuple.getT2();

                    String distinct = place.getAddress().split(" ")[2];
                    String name = place.getName();

                    log.info(distinct+" "+name);

                    return webClient.get()
                            .uri(uri -> uri
                                    .path("/v1/search/blog.json")
                                    .queryParam("query", distinct+" "+name)
                                    .build())
                            .header("X-Naver-Client-Id", naverClientId)
                            .header("X-Naver-Client-Secret", naverClientSecret)
                            .retrieve()
                            .bodyToMono(Map.class)
                            .map(response -> {
                                List<Map<String, Object>> results = (List<Map<String, Object>>) response.get("items");
                                if (results == null || results.isEmpty()) {
                                    return Collections.<BlogDTO>emptyList();
                                }

                                return results.stream()
                                        .map(result -> new BlogDTO(
                                                (String) result.get("title"),
                                                (String) result.get("link"),
                                                (String) result.get("bloggername"),
                                                (String) result.get("postdate")
                                        ))
                                        .toList();
                            })
                            .defaultIfEmpty(Collections.<BlogDTO>emptyList())
                            .doOnError(error -> error.printStackTrace())
                            .onErrorReturn(Collections.<BlogDTO>emptyList())
                            .map(blogDTOS -> new PlaceDetailDTO(placeId, blogDTOS, hashtags));
                })
                .doOnSubscribe(subscription -> log.info("subscribed to {}", subscription.toString()))
                .doOnError(throwable -> throwable.printStackTrace());
    }
}
