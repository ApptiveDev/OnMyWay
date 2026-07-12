package _team.onmyway.dto;

public record RecentPlaceDTO (
    Long placeId,
    String name,
    String categoryName,
    Integer elapsed,
    String imageURL,
    String catchPhrase,
    Double lat,
    Double lng,
    Integer walkingMinutes
) {}
