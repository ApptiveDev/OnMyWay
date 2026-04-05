package _team.onmyway.handler;

import _team.onmyway.exception.NoPlacesException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class OnmywayExceptionHandler {
    @ExceptionHandler(NoPlacesException.class)
    public String placeNotSearchException(NoPlacesException e) {
        return e.getMessage();
    }
}
