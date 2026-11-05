package com.stockflow.config;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> validation(MethodArgumentNotValidException e) {

        String msg = e.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(x -> x.getField() + ": " + x.getDefaultMessage())
                .findFirst()
                .orElse("Invalid request");

        return ResponseEntity.badRequest()
                .body(Map.of("message", msg));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> other(Exception e) {

        if (e instanceof ResponseStatusException r) {
            return ResponseEntity.status(r.getStatusCode())
                    .body(Map.of(
                            "message",
                            r.getReason() == null ? "Request failed" : r.getReason()
                    ));
        }

        return ResponseEntity.status(500)
                .body(Map.of("message", "Unexpected server error"));
    }
}