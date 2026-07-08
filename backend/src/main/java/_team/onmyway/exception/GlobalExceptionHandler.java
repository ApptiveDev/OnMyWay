package _team.onmyway.exception;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import javax.naming.AuthenticationException;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<String> handleUserNotFoundException(UserNotFoundException e) {
        return ResponseEntity.status(500).body(e.getMessage());
    }

    @ExceptionHandler(NotAuthenticationException.class)
    public ResponseEntity<String> handleNoAuthenticationException(NotAuthenticationException e) {
        return ResponseEntity.status(401).body(e.getMessage());
    }
}