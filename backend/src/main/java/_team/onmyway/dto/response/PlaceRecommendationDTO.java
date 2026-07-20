package _team.onmyway.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalTime;

@Getter
@AllArgsConstructor
public class PlaceRecommendationDTO {
    private Long id;
    private String name;
    private double lat;
    private double lng;
    private String category;
    private int walkingMinutes;
    private LocalTime openTime;
    private LocalTime closeTime;
    private String catchPhrase;

    @JsonProperty("isOpen")
    private boolean isOpen;

    private String imageURL;
    private boolean isLiked;
}
