package _team.onmyway.dto;

import _team.onmyway.entity.Route;
import _team.onmyway.entity.RouteType;

public record MyRouteDTO (
        Long id,
        String startName,
        String endName,
        RouteType routeType,
        Integer time,
        Double distance,
        Integer placeCount
) {
    public static MyRouteDTO from(Route route) {
        return new MyRouteDTO(
                route.getId(),
                route.getStartName(),
                route.getEndName(),
                route.getRouteType(),
                route.getTime(),
                route.getDistance(),
                route.getPlaceCount()
        );
    }
}
