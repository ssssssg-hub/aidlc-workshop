package com.tableorder.service;

import com.tableorder.dto.auth.*;
import com.tableorder.entity.Admin;
import com.tableorder.entity.Store;
import com.tableorder.entity.TableEntity;
import com.tableorder.entity.TableSession;
import com.tableorder.exception.AccountLockedException;
import com.tableorder.repository.*;
import com.tableorder.security.JwtUtil;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);
    private final StoreRepository storeRepository;
    private final AdminRepository adminRepository;
    private final TableRepository tableRepository;
    private final TableSessionRepository sessionRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthService(StoreRepository storeRepository, AdminRepository adminRepository,
                       TableRepository tableRepository, TableSessionRepository sessionRepository,
                       JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.storeRepository = storeRepository;
        this.adminRepository = adminRepository;
        this.tableRepository = tableRepository;
        this.sessionRepository = sessionRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public TokenResponse loginAdmin(LoginRequest request) {
        Store store = storeRepository.findByStoreIdentifier(request.storeIdentifier())
                .orElseThrow(() -> new EntityNotFoundException("Store not found"));

        Admin admin = adminRepository.findByStoreIdAndUsername(store.getId(), request.username())
                .orElseThrow(() -> new EntityNotFoundException("Admin not found"));

        if (admin.getLockedUntil() != null && admin.getLockedUntil().isAfter(LocalDateTime.now())) {
            log.warn("[SECURITY_EVENT] type=LOGIN_LOCKED, actor={}, storeId={}", admin.getUsername(), store.getId());
            throw new AccountLockedException("Account is locked. Try again later.");
        }

        if (!passwordEncoder.matches(request.password(), admin.getPasswordHash())) {
            admin.setFailedLoginAttempts(admin.getFailedLoginAttempts() + 1);
            if (admin.getFailedLoginAttempts() >= 5) {
                admin.setLockedUntil(LocalDateTime.now().plusMinutes(15));
                log.warn("[SECURITY_EVENT] type=ACCOUNT_LOCKED, actor={}, storeId={}", admin.getUsername(), store.getId());
            }
            log.warn("[SECURITY_EVENT] type=LOGIN_FAILURE, actor={}, storeId={}", admin.getUsername(), store.getId());
            throw new IllegalArgumentException("Invalid credentials");
        }

        admin.setFailedLoginAttempts(0);
        admin.setLockedUntil(null);

        String token = jwtUtil.generateToken(
                Map.of("storeId", store.getId(), "userId", admin.getId(), "role", "ADMIN"),
                admin.getUsername()
        );
        log.info("[SECURITY_EVENT] type=LOGIN_SUCCESS, actor={}, role=ADMIN, storeId={}", admin.getUsername(), store.getId());
        return new TokenResponse(token, jwtUtil.getExpirationMs() / 1000);
    }

    @Transactional
    public TableTokenResponse loginTable(TableLoginRequest request) {
        Store store = storeRepository.findByStoreIdentifier(request.storeIdentifier())
                .orElseThrow(() -> new EntityNotFoundException("Store not found"));

        TableEntity table = tableRepository.findByStoreIdAndTableNumber(store.getId(), request.tableNumber())
                .orElseThrow(() -> new EntityNotFoundException("Table not found"));

        if (!passwordEncoder.matches(request.password(), table.getPasswordHash())) {
            log.warn("[SECURITY_EVENT] type=TABLE_LOGIN_FAILURE, tableNumber={}, storeId={}", request.tableNumber(), store.getId());
            throw new IllegalArgumentException("Invalid credentials");
        }

        TableSession session = sessionRepository.findByTableIdAndActiveTrue(table.getId())
                .orElseGet(() -> sessionRepository.save(new TableSession(UUID.randomUUID().toString(), table.getId())));

        String token = jwtUtil.generateToken(
                Map.of("storeId", store.getId(), "tableId", table.getId(),
                       "sessionId", session.getId(), "role", "TABLE"),
                "table-" + table.getTableNumber()
        );
        log.info("[SECURITY_EVENT] type=TABLE_LOGIN_SUCCESS, tableNumber={}, storeId={}", request.tableNumber(), store.getId());
        return new TableTokenResponse(token, session.getSessionUuid());
    }
}
