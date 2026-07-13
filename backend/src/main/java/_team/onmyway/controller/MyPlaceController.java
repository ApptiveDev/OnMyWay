package _team.onmyway.controller;

import _team.onmyway.annotation.GetUser;
import _team.onmyway.dto.PlaceRecommendationDTO;
import _team.onmyway.service.MyPlaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
@RequestMapping("/api/myPlace")
@RequiredArgsConstructor
public class MyPlaceController {

    private final MyPlaceService myPlaceService;

    @GetMapping
    public Mono<List<PlaceRecommendationDTO>> getMyPlaces(@GetUser Long userId,
                                                          @RequestParam double lat,
                                                          @RequestParam double lon) {
        return myPlaceService.getLikePlaces(userId, lat, lon);
    }
}
