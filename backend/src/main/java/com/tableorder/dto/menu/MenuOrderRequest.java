package com.tableorder.dto.menu;

import jakarta.validation.constraints.NotNull;

public record MenuOrderRequest(
        @NotNull Long menuId,
        int displayOrder
) {}
