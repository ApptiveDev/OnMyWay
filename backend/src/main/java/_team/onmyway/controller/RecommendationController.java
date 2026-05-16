package _team.onmyway.controller;

import _team.onmyway.dto.AllCategoryRecommendationsDTO;
import _team.onmyway.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequiredArgsConstructor
@RequestMapping("/places")
public class RecommendationController {

    private final RecommendationService recommendationService;

    // 전체 카테고리 로드: 카테고리별 7개(대표 포함) + 메인용 대표 1개
    @GetMapping("/recommend")
    public Mono<AllCategoryRecommendationsDTO> recommendAllCategories(
            @RequestParam double lat,
            @RequestParam double lng
    ) {
        return recommendationService.recommend(lat, lng);
    }
}
