package _team.onmyway.service;

import _team.onmyway.entity.Photos;
import _team.onmyway.entity.Place;
import _team.onmyway.repository.PhotosRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@Service
public class ImageService {

    private final WebClient webClient;
    private final PhotosRepository photosRepository;

    public ImageService(PhotosRepository photosRepository) {
        this.photosRepository = photosRepository;
        this.webClient = WebClient.builder()
                .baseUrl("https://openapi.naver.com")
                .defaultHeader("X-Naver-Client-Id", "jSOzQhwW9F2Trv7pnGX4")
                .defaultHeader("X-Naver-Client-Secret", "qzFMoZ_Cr2")
                .build();
    }

    public Mono<String> getImageURL(Place p) {
        List<Photos> dbPhotos = p.getPhotos();
        if (dbPhotos.size() > 0) {
            return Mono.just(dbPhotos.get(0).getPhotoURL());
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
