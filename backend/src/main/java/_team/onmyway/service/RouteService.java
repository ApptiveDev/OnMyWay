package _team.onmyway.service;

import _team.onmyway.dto.PositionDTO;
import _team.onmyway.dto.RouteResponseDTO;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class RouteService {

    private final ObjectMapper objectMapper;

    @Value("${tmap.api.key}")
    private String tmapAPIKey;

    public Mono<RouteResponseDTO> rightRoute(List<PositionDTO> positions) {
        return resultRoute(positions);
    }

    public Mono<RouteResponseDTO> findOutRoute(List<PositionDTO> positions) {
        PositionDTO start = positions.get(0);
        PositionDTO end = positions.get(positions.size()-1);
        PositionDTO route = makeStopOver(start, end);

        return resultRoute(List.of(start, route, end));
    }

    public Mono<RouteResponseDTO> slowRoute(List<PositionDTO> positions) {
        PositionDTO start = positions.get(0);
        PositionDTO end = positions.get(positions.size()-1);

        List<PositionDTO> points = new ArrayList<>();
        points.add(start);
        for (int i = 0; i < 2; i++) {
            points.add(makeStopOver(start, end));
        }
        points.add(end);
        return resultRoute(points);
    }

    private Mono<RouteResponseDTO> resultRoute(List<PositionDTO> positions) {
        List<PositionDTO> passlist = new ArrayList<>(positions.subList(1, positions.size()-1));

        PositionDTO start = positions.get(0);
        PositionDTO end = positions.get(positions.size()-1);

        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("startX", String.valueOf(start.getLon()));
        formData.add("startY", String.valueOf(start.getLat()));
        formData.add("endX", String.valueOf(end.getLon()));
        formData.add("endY", String.valueOf(end.getLat()));

        String stopovers = "";
        if (passlist != null) {
            for (int i = 0; i<passlist.size(); i++) {
                stopovers += passlist.get(i).getLon()+","+passlist.get(i).getLat();
                if (i < passlist.size()-1) { stopovers += "_";}
            }
        }
        formData.add("passList",stopovers);

        formData.add("startName", "start");
        formData.add("endName", "end");
        formData.add("searchOption", "0");
        formData.add("reqCoordType", "WGS84GEO");
        formData.add("resCoordType", "WGS84GEO");

        WebClient testClient = WebClient.builder()
                .baseUrl("https://apis.openapi.sk.com")
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED_VALUE) // 헤더 타입 ENUM으로 설정
                .build();

        return testClient.post()
                .uri(uriBuilder -> uriBuilder
                        .path("/tmap/routes/pedestrian")
                        .queryParam("version", "1")
                        .build())
                .header("appKey", tmapAPIKey)
                .bodyValue(formData)
                .retrieve()
                .onStatus(HttpStatusCode::isError, response ->
                        response.bodyToMono(String.class).flatMap(error -> {
                            // WebClient 에러 시 로깅
                            System.err.println("TMap Error Body: " + error);
                            return Mono.error(new RuntimeException(error));
                        })
                )
                .bodyToMono(String.class)
                .map(rawString -> {
                    try {
                        return objectMapper.readValue(rawString, RouteResponseDTO.class);
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    private PositionDTO makeStopOver(PositionDTO start, PositionDTO end) {
        Double startLat = start.getLat(); // x축 역할 - 위도
        Double endLat = end.getLat();

        Double startLon = start.getLon(); // y축 역할 - 경도
        Double endLon = end.getLon();

        Double deltaLat = endLat - startLat;
        Double deltaLon = endLon - startLon;

        Double gradation = 0.0;

        if (deltaLat != 0.0) {
            gradation = deltaLon / deltaLat;
        }

        Double length = Math.sqrt(deltaLat * deltaLat + deltaLon * deltaLon);

        Double unitLat = deltaLat / length;
        Double unitLon = deltaLon / length;

        Double positionLat = deltaLat * Math.random() + startLat; // start ~ end까지 랜덤
        Double positionLon = startLon;

        if (gradation != 0.0) {
            positionLon = gradation*(positionLat-startLat) + startLon;
        }

        Double d = 0.0011;

        if (gradation > 0) {
            return new PositionDTO(positionLat+unitLon*d, positionLon-unitLat*d); // 시계방향 회전
        } else {
            return new PositionDTO(positionLat-unitLon*d, positionLon+unitLat*d); // 반시계방향 회전
        }
    }
}
