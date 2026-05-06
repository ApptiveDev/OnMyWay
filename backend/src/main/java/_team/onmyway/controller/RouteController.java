package _team.onmyway.controller;

import _team.onmyway.dto.AllCategoryRecommendationsDTO;
import _team.onmyway.dto.PositionDTO;
import _team.onmyway.dto.RouteResponseDTO;
import _team.onmyway.service.RecommendationService;
import _team.onmyway.service.RouteService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/route")
@RequiredArgsConstructor
public class RouteController {
    private final RouteService routeService;
    private final RecommendationService recommendationService;
    private final ObjectMapper objectMapper;

    @PostMapping("/findOut")
    public ResponseEntity<?> getFindOutRoute(@RequestBody List<PositionDTO> positions) {
        if (positions.isEmpty()) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        PositionDTO start = positions.get(0);

        RouteResponseDTO routing = routeService.findOutRoute(positions).block();
        AllCategoryRecommendationsDTO recommendations = recommendationService.recommendByRoute(routing, start.getLat(), start.getLon());

        ObjectNode response = objectMapper.createObjectNode();
        response.set("route", objectMapper.valueToTree(routing));
        response.set("recommendations", objectMapper.valueToTree(recommendations));

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/right")
    public ResponseEntity<?> getRightRoute(@RequestBody List<PositionDTO> positions) {
        if (positions.isEmpty()) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        PositionDTO start = positions.get(0);

        RouteResponseDTO routing = routeService.rightRoute(positions).block();
        AllCategoryRecommendationsDTO recommendations = recommendationService.recommendByRoute(routing, start.getLat(), start.getLon());

        ObjectNode response = objectMapper.createObjectNode();
        response.set("route", objectMapper.valueToTree(routing));
        response.set("recommendations", objectMapper.valueToTree(recommendations));

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/slow")
    public ResponseEntity<?> getRoute(@RequestBody List<PositionDTO> positions) {
        if (positions.isEmpty()) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        PositionDTO start = positions.get(0);

        RouteResponseDTO routing = routeService.slowRoute(positions).block();
        AllCategoryRecommendationsDTO recommendations = recommendationService.recommendByRoute(routing, start.getLat(), start.getLon());

        ObjectNode response = objectMapper.createObjectNode();
        response.set("route", objectMapper.valueToTree(routing));
        response.set("recommendations", objectMapper.valueToTree(recommendations));

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
