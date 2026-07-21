package _team.onmyway.controller.apis;

import _team.onmyway.dto.response.PlaceDetailDTO;
import _team.onmyway.service.place.PlaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/place")
@RequiredArgsConstructor
public class PlaceController {

    private final PlaceService placeService;

    @GetMapping("/{id}")
    public Mono<PlaceDetailDTO> getPlaceDetail(@PathVariable long id) {
        return placeService.getHashtags(id);
    }
}
