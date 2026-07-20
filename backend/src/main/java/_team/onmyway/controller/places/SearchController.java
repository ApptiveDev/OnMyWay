package _team.onmyway.controller.places;

import _team.onmyway.annotation.GetUser;
import _team.onmyway.dto.response.PointDTO;
import _team.onmyway.dto.response.PositionDTO;
import _team.onmyway.dto.response.SearchPlaceResultDTO;
import _team.onmyway.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/places")
public class SearchController {
    private final SearchService searchService;

    @GetMapping("/search")
    public ResponseEntity<Mono<List<PointDTO>>> searchPlace(@RequestParam String query, @RequestParam(required = false) Double lat, @RequestParam(required = false) Double lon) {
        PositionDTO point = new PositionDTO(lat, lon);
        Mono<List<PointDTO>> places = searchService.searchPlaces(query, point);
        return ResponseEntity.ok(places);
    }

    @GetMapping("/querySearch")
    public ResponseEntity<?> searchQueryPlace(@RequestParam String query, @RequestParam Double lat, @RequestParam Double lon, @GetUser Long userId) {
        PositionDTO point = new PositionDTO(lat, lon);
        Mono<List<SearchPlaceResultDTO>> places = searchService.searchPlaceResult(query, point, userId);
        return ResponseEntity.ok(places);
    }
}
