package _team.onmyway.dto;

import java.util.List;

public record PlaceDetailDTO(
        Long placeId,
        List<String> hashtags
) {}
