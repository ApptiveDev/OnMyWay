package _team.onmyway.service;

import org.springframework.stereotype.Component;

@Component
public class GeoDistanceService {
    private static final double EARTH_RADIUS_METERS = 6371000.0;
    private static final double DEFAULT_WALKING_METERS_PER_MINUTE = 67.0;

    public double distanceMeters(double fromLat, double fromLng, double toLat, double toLng) {
        double fromLatRad = Math.toRadians(fromLat);
        double toLatRad = Math.toRadians(toLat);
        double deltaLat = Math.toRadians(toLat - fromLat);
        double deltaLng = Math.toRadians(toLng - fromLng);

        double a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2)
                + Math.cos(fromLatRad) * Math.cos(toLatRad)
                * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS_METERS * c;
    }

    public int estimateWalkingMinutes(double distanceMeters) {
        return Math.max(1, (int) Math.ceil(distanceMeters / DEFAULT_WALKING_METERS_PER_MINUTE));
    }
}
