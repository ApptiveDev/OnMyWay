package _team.onmyway.dto.response;

import lombok.AllArgsConstructor;

import java.util.List;

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
    private List<String> hashtags;
    private boolean isLiked;
}
