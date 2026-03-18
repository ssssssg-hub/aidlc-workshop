package com.tableorder.exception;

public class OpenAiApiException extends RuntimeException {
    public OpenAiApiException(String message) {
        super(message);
    }
}
