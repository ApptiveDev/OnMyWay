package _team.onmyway.dto;

import _team.onmyway.entity.Place;
import _team.onmyway.entity.RoutePlace;

public record PlaceInfoDTO (
        Long id,
        String placeName,
        String imageURL,
        Double lat,
        Double lng,
        Integer routeTime
) {}
