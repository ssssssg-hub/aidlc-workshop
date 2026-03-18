package com.tableorder.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "stores")
public class Store extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String storeIdentifier;

    @Column(nullable = false)
    private String name;

    public Store() {}

    public Store(String storeIdentifier, String name) {
        this.storeIdentifier = storeIdentifier;
        this.name = name;
    }

    public Long getId() { return id; }
    public String getStoreIdentifier() { return storeIdentifier; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
