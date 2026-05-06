package _team.onmyway.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalTime;

@Getter
@AllArgsConstructor
public class PlaceRecommendationDTO {
    private String name;
    private double lat;
    private double lng;
    private String category;
    private int walkingMinutes;
    private LocalTime openTime;
    private LocalTime closeTime;
    private boolean isOpen;
}
