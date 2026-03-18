package com.tableorder.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_id", nullable = false)
    private Long orderId;

    @Column(name = "menu_id", nullable = false)
    private Long menuId;

    @Column(nullable = false)
    private String menuName;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Integer unitPrice;

    public OrderItem() {}

    public OrderItem(Long orderId, Long menuId, String menuName, Integer quantity, Integer unitPrice) {
        this.orderId = orderId;
        this.menuId = menuId;
        this.menuName = menuName;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
    }

    public Long getId() { return id; }
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
    public Long getMenuId() { return menuId; }
    public String getMenuName() { return menuName; }
    public Integer getQuantity() { return quantity; }
    public Integer getUnitPrice() { return unitPrice; }
}
