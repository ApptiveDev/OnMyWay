package _team.onmyway.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.util.List;

@Getter
@AllArgsConstructor
public class CategoryRecommendationDTO {
    private Long categoryId;
    private String categoryName;
    private List<PlaceRecommendationDTO> places;
    private PlaceRecommendationDTO featured;
}
