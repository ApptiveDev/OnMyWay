package _team.onmyway.controller;

import _team.onmyway.dto.PositionDTO;
import _team.onmyway.dto.RouteResponseDTO;
import _team.onmyway.service.RecommendationService;
import _team.onmyway.service.RouteService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;
import java.util.List;
import java.util.function.Function;

@RestController
@RequestMapping("/route")
@RequiredArgsConstructor
public class RouteController {
    private final RecommendationService recommendationService;
    private final RouteService routeService;
    private final ObjectMapper objectMapper;

    @PostMapping("/findOut")
    public Mono<ResponseEntity<?>> getFindOutRoute(@RequestBody List<PositionDTO> positions) {
        return processRouteAndRecommend(positions, routeService::findOutRoute);
    }

    @PostMapping("/right")
    public Mono<ResponseEntity<?>> getRightRoute(@RequestBody List<PositionDTO> positions) {
        return processRouteAndRecommend(positions, routeService::rightRoute);
    }

    @PostMapping("/slow")
    public Mono<ResponseEntity<?>> getRoute(@RequestBody List<PositionDTO> positions) {
        return processRouteAndRecommend(positions, routeService::slowRoute);
    }

    // 비동기 로직 한 번에 묶기
    private Mono<ResponseEntity<?>> processRouteAndRecommend(
            List<PositionDTO> positions,
            Function<List<PositionDTO>, Mono<RouteResponseDTO>> processer) {
        if (positions.isEmpty()) return Mono.just(new ResponseEntity<>(HttpStatus.BAD_REQUEST));
        PositionDTO start = positions.get(0);
        return processer.apply(positions)
                .flatMap(routing -> recommendationService.recommendByRoute(routing, start.getLat(), start.getLon())
                        .map(recommendations -> {
                            ObjectNode response = objectMapper.createObjectNode();
                            response.set("route", objectMapper.valueToTree(routing));
                            response.set("recommendations", objectMapper.valueToTree(recommendations));

                            return new ResponseEntity<>(response, HttpStatus.OK);
                        }));
    }
}
