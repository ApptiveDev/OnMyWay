package _team.onmyway.controller;

import _team.onmyway.dto.PointDTO;
import _team.onmyway.dto.PositionDTO;
import _team.onmyway.dto.SearchPlaceResultDTO;
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
    public ResponseEntity<Mono<List<PointDTO>>> searchPlace(@RequestParam String query, @RequestParam Double lat, @RequestParam Double lon) {
        PositionDTO point = new PositionDTO(lat, lon);
        Mono<List<PointDTO>> places = searchService.searchPlaces(query, point);
        return ResponseEntity.ok(places);
    }

    @GetMapping("/places/querySearch")
    public ResponseEntity<?> searchQueryPlace(@RequestParam String query, @RequestParam Double lat, @RequestParam Double lon) {
        PositionDTO point = new PositionDTO(lat, lon);
        Mono<List<SearchPlaceResultDTO>> places = searchService.searchPlaceResult(query, point);
        return ResponseEntity.ok(places);
    }
}
