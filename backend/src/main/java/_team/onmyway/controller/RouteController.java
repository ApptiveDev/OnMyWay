package _team.onmyway.controller;

import _team.onmyway.dto.PositionDTO;
import _team.onmyway.service.RouteService;
import com.fasterxml.jackson.databind.JsonNode;
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

    @PostMapping("/slow")
    public ResponseEntity<?> getSlowRoutes(@RequestBody List<PositionDTO> positions) {
        JsonNode routing = routeService.slowRoute(positions).block();
        return new ResponseEntity<>(routing, HttpStatus.OK);
    }

    @PostMapping("/right")
    public ResponseEntity<?> getRightRoute(@RequestBody List<PositionDTO> positions) {
        JsonNode routing = routeService.rightRoute(positions).block();
        return new ResponseEntity<>(routing, HttpStatus.OK);
    }
}
