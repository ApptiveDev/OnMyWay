package _team.onmyway.controller;

import _team.onmyway.annotation.GetUser;
import _team.onmyway.dto.RecentPlaceDTO;
import _team.onmyway.service.RecentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
@RequestMapping("/api/recent")
@RequiredArgsConstructor
public class RecentController {

    private final RecentService recentService;

    @GetMapping
    public Mono<List<RecentPlaceDTO>> getRecentPlaces(@GetUser Long userId,
                                                      @RequestParam double lat, @RequestParam double lng) {
        return recentService.RecentPlaces(userId, lat, lng);
    }
}
