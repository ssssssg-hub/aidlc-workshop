package com.tableorder.dto.order;

import com.tableorder.entity.OrderStatus;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
        Long id, String orderNumber, Long tableId, Integer totalAmount,
        OrderStatus status, LocalDateTime createdAt, List<OrderItemResponse> items
) {}
