package _team.onmyway.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class AllCategoryRecommendationsDTO {
    private List<CategoryRecommendationDTO> categories;
}
