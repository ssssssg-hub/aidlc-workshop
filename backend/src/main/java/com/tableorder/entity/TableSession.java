package com.tableorder.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "table_sessions")
public class TableSession extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String sessionUuid;

    @Column(name = "table_id", nullable = false)
    private Long tableId;

    private LocalDateTime startedAt;
    private LocalDateTime endedAt;

    @Column(nullable = false)
    private boolean active = true;

    public TableSession() {}

    public TableSession(String sessionUuid, Long tableId) {
        this.sessionUuid = sessionUuid;
        this.tableId = tableId;
        this.startedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public String getSessionUuid() { return sessionUuid; }
    public Long getTableId() { return tableId; }
    public LocalDateTime getStartedAt() { return startedAt; }
    public LocalDateTime getEndedAt() { return endedAt; }
    public boolean isActive() { return active; }

    public void endSession() {
        this.active = false;
        this.endedAt = LocalDateTime.now();
    }
}
