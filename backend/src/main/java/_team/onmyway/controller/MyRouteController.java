package _team.onmyway.controller;

import _team.onmyway.annotation.GetUser;
import _team.onmyway.dto.MyRouteDTO;
import _team.onmyway.dto.RouteDetailDTO;
import _team.onmyway.service.MyRouteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
@RequestMapping("/api/route")
@RequiredArgsConstructor
public class MyRouteController {
    private final MyRouteService myRouteService;

    @GetMapping
    public ResponseEntity<?> getRoutes(@GetUser Long userId) {
        List<MyRouteDTO> myRouteDTOS = myRouteService.getRouteInfo(userId);
        return new ResponseEntity<>(myRouteDTOS, HttpStatus.OK);
    }

    @GetMapping("/{routeId}")
    public ResponseEntity<?> getRouteDetails(@PathVariable Long routeId) {
        Mono<RouteDetailDTO> routeDetail = myRouteService.getRouteDetail(routeId);
        return new ResponseEntity<>(routeDetail, HttpStatus.OK);
    }
}
