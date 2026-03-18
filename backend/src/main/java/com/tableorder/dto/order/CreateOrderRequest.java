package com.tableorder.dto.order;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record CreateOrderRequest(
        @NotNull Long storeId,
        @NotNull Long tableId,
        @NotNull Long sessionId,
        @NotEmpty @Valid List<OrderItemRequest> items
) {}
