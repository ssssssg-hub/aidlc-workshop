package com.tableorder.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "order_history")
public class OrderHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long originalOrderId;

    @Column(nullable = false)
    private String orderNumber;

    @Column(nullable = false)
    private Long storeId;

    @Column(nullable = false)
    private Long tableId;

    @Column(nullable = false)
    private String sessionUuid;

    @Column(nullable = false)
    private Integer totalAmount;

    @Column(nullable = false)
    private LocalDateTime orderedAt;

    @Column(nullable = false)
    private LocalDateTime completedAt;

    @OneToMany(mappedBy = "orderHistoryId", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderHistoryItem> items = new ArrayList<>();

    public OrderHistory() {}

    public Long getId() { return id; }
    public Long getOriginalOrderId() { return originalOrderId; }
    public void setOriginalOrderId(Long originalOrderId) { this.originalOrderId = originalOrderId; }
    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }
    public Long getStoreId() { return storeId; }
    public void setStoreId(Long storeId) { this.storeId = storeId; }
    public Long getTableId() { return tableId; }
    public void setTableId(Long tableId) { this.tableId = tableId; }
    public String getSessionUuid() { return sessionUuid; }
    public void setSessionUuid(String sessionUuid) { this.sessionUuid = sessionUuid; }
    public Integer getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Integer totalAmount) { this.totalAmount = totalAmount; }
    public LocalDateTime getOrderedAt() { return orderedAt; }
    public void setOrderedAt(LocalDateTime orderedAt) { this.orderedAt = orderedAt; }
    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
    public List<OrderHistoryItem> getItems() { return items; }
    public void setItems(List<OrderHistoryItem> items) { this.items = items; }
}
