package _team.onmyway.dto.response;

import java.util.List;

public record PlaceDetailDTO(
        Long placeId,
        List<BlogDTO> blogDTOS,
        List<String> hashtags
) {}
