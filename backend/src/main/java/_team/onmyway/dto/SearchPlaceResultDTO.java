package _team.onmyway.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class SearchPlaceResultDTO {
    private Long placeId;
    private String placeName;
    private Double lat;
    private Double lon;
    private Double distance;
    private String category;
    private String imageURL;
    private boolean isOpen;
}
