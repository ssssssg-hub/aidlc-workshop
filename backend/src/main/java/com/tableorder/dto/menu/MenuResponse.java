package com.tableorder.dto.menu;

public record MenuResponse(
        Long id, String name, Integer price, String description,
        String imageUrl, Long categoryId, int displayOrder
) {}
