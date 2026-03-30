package _team.onmyway.controller;

import _team.onmyway.dto.RecommendationResponseDTO;
import _team.onmyway.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/places")
public class RecommendationController {

    private final RecommendationService recommendationService;

    // 전체 추천 (7개 조합)
    @GetMapping("/recommend")
    public RecommendationResponseDTO recommend(
            @RequestParam double lat,
            @RequestParam double lng
    ) {
        return recommendationService.recommend(lat, lng);
    }

    // 카테고리 필터 (7개 전부 같은 카테고리)
    @GetMapping("/recommend/category")
    public RecommendationResponseDTO recommendByCategory(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam Long categoryId
    ) {
        return recommendationService.recommendByCategory(lat, lng, categoryId);
    }
}
