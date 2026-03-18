package com.tableorder.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "tables", uniqueConstraints = @UniqueConstraint(columnNames = {"store_id", "table_number"}))
public class TableEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "store_id", nullable = false)
    private Long storeId;

    @Column(name = "table_number", nullable = false)
    private Integer tableNumber;

    @Column(nullable = false)
    private String passwordHash;

    public TableEntity() {}

    public TableEntity(Long storeId, Integer tableNumber, String passwordHash) {
        this.storeId = storeId;
        this.tableNumber = tableNumber;
        this.passwordHash = passwordHash;
    }

    public Long getId() { return id; }
    public Long getStoreId() { return storeId; }
    public Integer getTableNumber() { return tableNumber; }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
}
