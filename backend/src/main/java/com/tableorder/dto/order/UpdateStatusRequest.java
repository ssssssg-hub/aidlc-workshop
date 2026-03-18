package com.tableorder.dto.order;

import com.tableorder.entity.OrderStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateStatusRequest(@NotNull OrderStatus status) {}
