package com.tableorder.security;

import io.jsonwebtoken.Claims;

public record AuthDetails(Long storeId, Claims claims) {

    public Long getUserId() {
        return claims.get("userId", Long.class);
    }

    public Long getTableId() {
        return claims.get("tableId", Long.class);
    }

    public Long getSessionId() {
        return claims.get("sessionId", Long.class);
    }

    public String getRole() {
        return claims.get("role", String.class);
    }
}
