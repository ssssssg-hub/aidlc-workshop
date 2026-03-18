package com.tableorder.dto.table;

import com.tableorder.dto.order.OrderItemResponse;
import java.time.LocalDateTime;
import java.util.List;

public record OrderHistoryResponse(
        Long id, String orderNumber, Integer totalAmount,
        LocalDateTime orderedAt, LocalDateTime completedAt,
        List<OrderItemResponse> items
) {}
