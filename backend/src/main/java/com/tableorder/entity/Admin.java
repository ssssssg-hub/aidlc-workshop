package com.tableorder.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "admins", uniqueConstraints = @UniqueConstraint(columnNames = {"store_id", "username"}))
public class Admin extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "store_id", nullable = false)
    private Long storeId;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String passwordHash;

    @Column(nullable = false)
    private int failedLoginAttempts = 0;

    private LocalDateTime lockedUntil;

    public Admin() {}

    public Admin(Long storeId, String username, String passwordHash) {
        this.storeId = storeId;
        this.username = username;
        this.passwordHash = passwordHash;
    }

    public Long getId() { return id; }
    public Long getStoreId() { return storeId; }
    public String getUsername() { return username; }
    public String getPasswordHash() { return passwordHash; }
    public int getFailedLoginAttempts() { return failedLoginAttempts; }
    public void setFailedLoginAttempts(int failedLoginAttempts) { this.failedLoginAttempts = failedLoginAttempts; }
    public LocalDateTime getLockedUntil() { return lockedUntil; }
    public void setLockedUntil(LocalDateTime lockedUntil) { this.lockedUntil = lockedUntil; }
}
