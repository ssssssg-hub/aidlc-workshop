package com.tableorder.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "order_history_items")
public class OrderHistoryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_history_id", nullable = false)
    private Long orderHistoryId;

    @Column(nullable = false)
    private String menuName;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Integer unitPrice;

    public OrderHistoryItem() {}

    public OrderHistoryItem(Long orderHistoryId, String menuName, Integer quantity, Integer unitPrice) {
        this.orderHistoryId = orderHistoryId;
        this.menuName = menuName;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
    }

    public Long getId() { return id; }
    public Long getOrderHistoryId() { return orderHistoryId; }
    public String getMenuName() { return menuName; }
    public Integer getQuantity() { return quantity; }
    public Integer getUnitPrice() { return unitPrice; }
}
