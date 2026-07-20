package _team.onmyway.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public class PointDTO {
    private String placeName;
    private Double latitude;
    private Double longitude;
    private String address;
    private String roadAddress;
}
