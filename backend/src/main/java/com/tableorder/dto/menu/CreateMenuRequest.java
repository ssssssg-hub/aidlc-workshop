package com.tableorder.dto.menu;

import jakarta.validation.constraints.*;

public record CreateMenuRequest(
        @NotBlank @Size(max = 100) String name,
        @NotNull @Min(100) @Max(1000000) Integer price,
        @Size(max = 500) String description,
        @NotNull Long categoryId,
        String imageUrl,
        int displayOrder
) {}
