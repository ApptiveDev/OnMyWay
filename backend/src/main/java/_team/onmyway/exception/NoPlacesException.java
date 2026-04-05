package _team.onmyway.exception;

public class NoPlacesException extends RuntimeException {
    public NoPlacesException(String message) {
        super("해당하는 출발지/목적지가 나오지 않아요!");
    }
}
