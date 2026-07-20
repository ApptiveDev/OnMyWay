package _team.onmyway.controller.apis;

import _team.onmyway.annotation.GetUser;
import _team.onmyway.dto.request.UpdatePlaceDTO;
import _team.onmyway.service.UpdatePlaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/update")
@RequiredArgsConstructor
public class UpdatePlaceController {

    private final UpdatePlaceService updatePlaceService;

    @PostMapping("/{placeId}")
    public ResponseEntity<?> updatePlace(@RequestBody UpdatePlaceDTO updatePlaceDTO,
                                         @PathVariable Long placeId,
                                         @GetUser Long userId) {
        String updateMessage = updatePlaceService.updateRequest(updatePlaceDTO, placeId, userId);
        return ResponseEntity.ok(updateMessage);
    }
}
