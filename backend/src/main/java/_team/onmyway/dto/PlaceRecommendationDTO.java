package _team.onmyway.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PlaceRecommendationDTO {
    private String name;
    private double lat;
    private double lng;
    private String category;
    private int walkingMinutes;
}
