package _team.onmyway.service;

import _team.onmyway.dto.*;
import _team.onmyway.entity.Place;
import _team.onmyway.entity.Route;
import _team.onmyway.entity.StopOver;
import _team.onmyway.repository.RouteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MyRouteService {

    private final RouteRepository routeRepository;
    private final RouteService routeService;
    private final ImageService imageService;
    private final GeoDistanceService geoDistanceService;

    public List<MyRouteDTO> getRouteInfo(Long userId) {
        List<Route> routes = routeRepository.findByUsersId(userId);

        List<MyRouteDTO> routeDTOs = new ArrayList<>();
        for (Route route : routes) {
            MyRouteDTO.from(route);
        }
        return routeDTOs;
    }

    public Mono<RouteDetailDTO> getRouteDetail(Long routeId) {
        Route route = routeRepository.findById(routeId);
        List<StopOver> stopOvers = route.getStopOvers()
                .stream().sorted(Comparator.comparingInt(StopOver::getVisit_order))
                .toList();

        List<PositionDTO> positions = List.of(new PositionDTO(
                route.getStartLat(), route.getStartLon()
        ));
        for (StopOver stopOver : stopOvers) {
            positions.add(new PositionDTO(stopOver.getStop_lat(), stopOver.getStop_lon()));
        }
        positions.add(new PositionDTO(route.getEndLat(), route.getEndLon()));

        Mono<List<PlaceInfoDTO>> placeInfos = Flux.fromIterable(route.getRoutePlaces())
                .flatMap(routeP -> {
                    Place place = routeP.getPlace();

                    return imageService.getImageURL(place)
                            .map(image -> new PlaceInfoDTO(
                                    place.getId(),
                                    place.getName(),
                                    image,
                                    place.getLat(),
                                    place.getLng(),
                                    (int)(1+Math.random()*2)
                            ));
                })
                .collectList();

        Mono<RouteResponseDTO> routeResponseDTOMono = routeService.resultRoute(positions);

        // 2가지 비동기 작업 병렬 시도
        return Mono.zip(placeInfos, routeResponseDTOMono)
                .map(tuple -> {
                    List<PlaceInfoDTO> placeInfoDTOS = tuple.getT1();
                    RouteResponseDTO routeResponseDTO = tuple.getT2();

                    for (PlaceInfoDTO placeInfoDTO : placeInfoDTOS) {
                        int distance = (int)getMinDistance(routeResponseDTO, placeInfoDTO);

                    }
                    return new RouteDetailDTO(placeInfoDTOS, routeResponseDTO);
                });
    }

    public double getMinDistance(RouteResponseDTO routeResponseDTO, PlaceInfoDTO placeInfoDTO) {
        double minDistance = Double.MAX_VALUE;

        for (RouteResponseDTO.FeatureDTO feature : routeResponseDTO.getFeatures()) {
            RouteResponseDTO.GeometryDTO geometryDTO = feature.getGeometry();

            if (geometryDTO!=null && "LineString".equals(geometryDTO.getType())) {
                List<List<Double>> coordinates = (List<List<Double>>)geometryDTO.getCoordinates();

                for (List<Double> coordinate : coordinates) {
                    double routeLon = coordinate.get(0);
                    double routeLat = coordinate.get(1);

                    double distance = geoDistanceService.distanceMeters(
                            placeInfoDTO.lat(), placeInfoDTO.lng(), routeLat, routeLon
                    );

                    if (distance < minDistance) {
                        minDistance = distance;
                    }
                }
            }
        }
        return minDistance;
    }
}
