package com.tableorder.dto.table;

import com.tableorder.dto.order.OrderResponse;
import java.util.List;

public record TableStatusResponse(
        Long tableId, Integer tableNumber, boolean hasActiveSession,
        Integer totalOrderAmount, List<OrderResponse> recentOrders
) {}
