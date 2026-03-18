package com.tableorder.service;

import com.tableorder.dto.auth.LoginRequest;
import com.tableorder.dto.auth.TableLoginRequest;
import com.tableorder.dto.auth.TableTokenResponse;
import com.tableorder.dto.auth.TokenResponse;
import com.tableorder.entity.Admin;
import com.tableorder.entity.Store;
import com.tableorder.entity.TableEntity;
import com.tableorder.entity.TableSession;
import com.tableorder.exception.AccountLockedException;
import com.tableorder.repository.*;
import com.tableorder.security.JwtUtil;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private StoreRepository storeRepository;
    @Mock private AdminRepository adminRepository;
    @Mock private TableRepository tableRepository;
    @Mock private TableSessionRepository sessionRepository;
    @Mock private JwtUtil jwtUtil;
    @Mock private PasswordEncoder passwordEncoder;

    @InjectMocks private AuthService authService;

    private Store store;
    private Admin admin;

    @BeforeEach
    void setUp() {
        store = new Store("STORE001", "Test Store");
        admin = new Admin(1L, "admin", "$2a$10$hash");
    }

    @Test
    void loginAdmin_success() {
        when(storeRepository.findByStoreIdentifier("STORE001")).thenReturn(Optional.of(store));
        when(adminRepository.findByStoreIdAndUsername(any(), eq("admin"))).thenReturn(Optional.of(admin));
        when(passwordEncoder.matches("password", admin.getPasswordHash())).thenReturn(true);
        when(jwtUtil.generateToken(anyMap(), eq("admin"))).thenReturn("jwt-token");
        when(jwtUtil.getExpirationMs()).thenReturn(57600000L);

        TokenResponse response = authService.loginAdmin(new LoginRequest("STORE001", "admin", "password"));

        assertThat(response.token()).isEqualTo("jwt-token");
        verify(jwtUtil).generateToken(anyMap(), eq("admin"));
    }

    @Test
    void loginAdmin_invalidPassword_incrementsFailedAttempts() {
        when(storeRepository.findByStoreIdentifier("STORE001")).thenReturn(Optional.of(store));
        when(adminRepository.findByStoreIdAndUsername(any(), eq("admin"))).thenReturn(Optional.of(admin));
        when(passwordEncoder.matches("wrong", admin.getPasswordHash())).thenReturn(false);

        assertThatThrownBy(() -> authService.loginAdmin(new LoginRequest("STORE001", "admin", "wrong")))
                .isInstanceOf(IllegalArgumentException.class);
        assertThat(admin.getFailedLoginAttempts()).isEqualTo(1);
    }

    @Test
    void loginAdmin_lockedAccount_throwsException() {
        admin.setLockedUntil(LocalDateTime.now().plusMinutes(10));
        when(storeRepository.findByStoreIdentifier("STORE001")).thenReturn(Optional.of(store));
        when(adminRepository.findByStoreIdAndUsername(any(), eq("admin"))).thenReturn(Optional.of(admin));

        assertThatThrownBy(() -> authService.loginAdmin(new LoginRequest("STORE001", "admin", "password")))
                .isInstanceOf(AccountLockedException.class);
    }

    @Test
    void loginAdmin_storeNotFound_throwsException() {
        when(storeRepository.findByStoreIdentifier("INVALID")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.loginAdmin(new LoginRequest("INVALID", "admin", "password")))
                .isInstanceOf(EntityNotFoundException.class);
    }

    @Test
    void loginTable_success_createsNewSession() {
        TableEntity table = new TableEntity(1L, 1, "$2a$10$hash");
        when(storeRepository.findByStoreIdentifier("STORE001")).thenReturn(Optional.of(store));
        when(tableRepository.findByStoreIdAndTableNumber(any(), eq(1))).thenReturn(Optional.of(table));
        when(passwordEncoder.matches("pass", table.getPasswordHash())).thenReturn(true);
        when(sessionRepository.findByTableIdAndActiveTrue(any())).thenReturn(Optional.empty());
        when(sessionRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(jwtUtil.generateToken(anyMap(), anyString())).thenReturn("table-jwt");

        TableTokenResponse response = authService.loginTable(new TableLoginRequest("STORE001", 1, "pass"));

        assertThat(response.token()).isEqualTo("table-jwt");
        verify(sessionRepository).save(any(TableSession.class));
    }
}
