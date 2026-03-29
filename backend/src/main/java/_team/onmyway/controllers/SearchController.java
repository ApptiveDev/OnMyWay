package _team.onmyway.controllers;

import _team.onmyway.dto.PointDTO;
import _team.onmyway.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class SearchController {
    private final SearchService searchService;

    @GetMapping("/places/search")
    public ResponseEntity<Mono<List<PointDTO>>> searchPlace(@RequestParam String query) {
        Mono<List<PointDTO>> places = searchService.searchPlaces(query);
        return ResponseEntity.ok(places);
    }
}
