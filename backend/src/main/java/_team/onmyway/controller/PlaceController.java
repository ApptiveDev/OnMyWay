package _team.onmyway.controller;

import _team.onmyway.dto.PlaceDetailDTO;
import _team.onmyway.service.PlaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/place")
@RequiredArgsConstructor
public class PlaceController {

    private final PlaceService placeService;

    @GetMapping("/{id}")
    public ResponseEntity<PlaceDetailDTO> getPlaceDetail(@PathVariable long id) {
        PlaceDetailDTO placeDetailDTO = placeService.getHashtags(id);
        return new ResponseEntity<>(placeDetailDTO, HttpStatus.OK);
    }
}
