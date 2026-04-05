package _team.onmyway.service;

import _team.onmyway.dto.PointDTO;
import _team.onmyway.exception.NoPlacesException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;

@Service
public class SearchService {
    @Value("${KAKAO_CLIENT_ID}")
    private String apiKey;

    public Mono<List<PointDTO>> searchPlaces(String query) {
        ObjectMapper mapper = new ObjectMapper();

        WebClient webClient = WebClient.builder() // 카카오 API로 출발지/목적지 검색
                .baseUrl("https://dapi.kakao.com/v2/local/search/keyword.json")
                .defaultHeader(HttpHeaders.AUTHORIZATION, "KakaoAK "+apiKey)
                .build();

        Mono<String> resp = webClient.get()
                .uri(uribuilder -> uribuilder
                        .queryParam("query", query) // 검색어 추가
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

                return allPlaces;
            } catch (JsonProcessingException e) {
                e.printStackTrace();
                return null;
            }
        });
        return document;
    }
}
