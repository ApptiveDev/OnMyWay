package _team.onmyway.service;

import _team.onmyway.entity.Photos;
import _team.onmyway.entity.Place;
import _team.onmyway.repository.PhotosRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.beans.factory.annotation.Value;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@Service
public class ImageService {

    private final WebClient webClient;
    private final PhotosRepository photosRepository;

    @Value("${naver.api.clientId}")
    private String naverClientId;

    @Value("${naver.api.clientSecret}")
    private String naverClientSecret;

    public ImageService(PhotosRepository photosRepository) {
        this.photosRepository = photosRepository;
        this.webClient = WebClient.builder()
                .baseUrl("https://openapi.naver.com")
                .defaultHeader("X-Naver-Client-Id", naverClientId)
                .defaultHeader("X-Naver-Client-Secret", naverClientSecret)
                .build();
    }

    public Mono<String> getImageURL(Place p) {
        boolean hasPhoto = photosRepository.existsById(p.getId());
        if (hasPhoto) {
            return Mono.just(photosRepository.findFirstByPlaceId(p.getId()).get().getPhotoURL());
        } else {
            return webClient.get()
                    .uri(uri -> uri
                            .path("/v1/search/image")
                            .queryParam("query",p.getName()+" 외관")
                            .queryParam("sort","sim")
                            .build())
                    .retrieve()
                    .bodyToMono(Map.class)
                    .map(response -> {
                        // items 리스트 추출
                        List<Map<String, Object>> list = (List<Map<String, Object>>) response.get("items");
                        if (list == null || list.isEmpty()) {
                            return ""; // 결과 없으면 빈 문자열
                        }
                        return (String) list.get(0).get("thumbnail");
                    })
                    .defaultIfEmpty("") // 혹시 모를 빈 응답 처리
                    .onErrorReturn(""); // API 에러 발생 시 빈 문자열 반환 (서비스 중단 방지)
        }
    }
}
