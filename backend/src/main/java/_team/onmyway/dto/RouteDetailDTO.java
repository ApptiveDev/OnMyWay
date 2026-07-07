package _team.onmyway.dto;

import java.util.List;

public record RouteDetailDTO(
        List<PlaceInfoDTO> places,
        RouteResponseDTO route
) {}
