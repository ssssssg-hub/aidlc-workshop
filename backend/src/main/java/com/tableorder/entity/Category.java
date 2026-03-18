package com.tableorder.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "categories")
public class Category extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "store_id", nullable = false)
    private Long storeId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private int displayOrder = 0;

    public Category() {}

    public Category(Long storeId, String name, int displayOrder) {
        this.storeId = storeId;
        this.name = name;
        this.displayOrder = displayOrder;
    }

    public Long getId() { return id; }
    public Long getStoreId() { return storeId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(int displayOrder) { this.displayOrder = displayOrder; }
}
