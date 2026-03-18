package com.tableorder.controller;

import com.tableorder.dto.auth.*;
import com.tableorder.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/admin/auth/login")
    public ResponseEntity<TokenResponse> loginAdmin(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.loginAdmin(request));
    }

    @PostMapping("/table/auth/login")
    public ResponseEntity<TableTokenResponse> loginTable(@Valid @RequestBody TableLoginRequest request) {
        return ResponseEntity.ok(authService.loginTable(request));
    }
}
