package _team.onmyway.service;

import org.springframework.stereotype.Service;

@Service
public class DistanceService {
    public Double distance(Double lat1, Double lng1, Double lat2, Double lng2) {
        final int R = 6371;

        double rLat1 = Math.toRadians(lat1);
        double rLat2 = Math.toRadians(lat2);
        double dlat = Math.toRadians(lat2 - lat1);
        double dlng = Math.toRadians(lng2 - lng1);
        double angle = Math.sin(dlat/2)+Math.cos(rLat1)*Math.cos(rLat2)*Math.sin(dlng/2);

        return 2*R*Math.asin(Math.sqrt(angle));
    }
}
