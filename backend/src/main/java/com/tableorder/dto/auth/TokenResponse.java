package com.tableorder.dto.auth;

public record TokenResponse(String token, long expiresIn) {}
