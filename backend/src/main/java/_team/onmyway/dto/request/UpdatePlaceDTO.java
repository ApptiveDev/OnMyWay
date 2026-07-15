package _team.onmyway.dto.request;

import java.time.LocalTime;
import java.util.List;

public class UpdatePlaceDTO {
    private long id;
    private String catchPhrase;
    private List<String> imageURLs;
    private LocalTime open;
    private LocalTime close;
}
