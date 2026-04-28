package _team.onmyway.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class RouteResponseDTO {
    private String type;
    private List<FeatureDTO> features;

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class FeatureDTO {
        private String type;
        private GeometryDTO geometry;
        private PropertiesDTO properties;
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class GeometryDTO {
        private String type;
        private Object coordinates; // Point의 경우 Double[], LineString의 경우 List<Double[]>
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class PropertiesDTO {
        // 공통 속성
        private Integer index;
        private String name;
        private String description;
        private String facilityType;
        private String facilityName;

        // Point 전용
        private Integer totalDistance;
        private Integer totalTime;
        private Integer pointIndex;
        private String direction;
        private String nearPoiName;
        private String nearPoiX;
        private String nearPoiY;
        private String intersectionName;
        private Integer turnType;
        private String pointType;

        // LineString 전용
        private Integer lineIndex;
        private Integer distance;
        private Integer time;
        private Integer roadType;
        private Integer categoryRoadType;
    }
}
