package _team.onmyway.controller;

import _team.onmyway.dto.PlaceDetailDTO;
import _team.onmyway.service.PlaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
