package _team.onmyway.controller;

import _team.onmyway.annotation.GetUser;
import _team.onmyway.dto.PointDTO;
import _team.onmyway.dto.PositionDTO;
import _team.onmyway.dto.RecentPlaceDTO;
import _team.onmyway.dto.SearchPlaceResultDTO;
import _team.onmyway.service.RecentService;
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
    private final RecentService recentService;

    @GetMapping("/places/search")
    public ResponseEntity<Mono<List<PointDTO>>> searchPlace(@RequestParam String query, @RequestParam Double lat, @RequestParam Double lon) {
        PositionDTO point = new PositionDTO(lat, lon);
        Mono<List<PointDTO>> places = searchService.searchPlaces(query, point);
        return ResponseEntity.ok(places);
    }

    @GetMapping("/places/querySearch")
    public Mono<List<SearchPlaceResultDTO>> searchQueryPlace(@RequestParam String query, @RequestParam Double lat, @RequestParam Double lon) {
        PositionDTO point = new PositionDTO(lat, lon);
        Mono<List<SearchPlaceResultDTO>> places = searchService.searchPlaceResult(query, point);
        return places;
    }

    @GetMapping("/places/recent")
    public Mono<List<RecentPlaceDTO>> recentPlaces(@GetUser Long userId, @RequestParam Double lat, @RequestParam Double lon) {
        Mono<List<RecentPlaceDTO>> recentPlaces = recentService.RecentPlaces(userId, lat, lon);
        return recentPlaces;
    }
}
