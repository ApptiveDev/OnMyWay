package _team.onmyway.dto;

import _team.onmyway.entity.Place;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@AllArgsConstructor
public class RecommendationResponseDTO {

    private List<PlaceInfo> places;

    public static RecommendationResponseDTO from(List<Place> places, double userLat, double userLng) {
        return new RecommendationResponseDTO(
                places.stream()
                        .map(p -> PlaceInfo.from(p, userLat, userLng))
                        .collect(Collectors.toList())
        );
    }

    @Getter
    @AllArgsConstructor
    static class PlaceInfo {
        private String name;
        private double lat;
        private double lng;
        private String category;
        private int walkingMinutes;

        public static PlaceInfo from(Place p, double userLat, double userLng) {

            double distance = calculateDistance(userLat, userLng, p.getLat(), p.getLng());
            int minutes = (int) (distance / 80); // 80m = 1분

            return new PlaceInfo(
                    p.getName(),
                    p.getLat(),
                    p.getLng(),
                    p.getServiceCategory().getName(),
                    minutes
            );
        }

        private static double calculateDistance(double lat1, double lng1, double lat2, double lng2) {
            double dx = lat1 - lat2;
            double dy = lng1 - lng2;
            return Math.sqrt(dx * dx + dy * dy) * 111000;
        }
    }
}
