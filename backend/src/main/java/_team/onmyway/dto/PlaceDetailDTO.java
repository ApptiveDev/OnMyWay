package _team.onmyway.dto;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.List;

public record PlaceDetailDTO(
        Long placeId,
        List<BlogDTO> blogDTOS,
        List<String> hashtags
) {}
