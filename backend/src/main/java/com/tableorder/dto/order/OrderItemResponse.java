package com.tableorder.dto.order;

public record OrderItemResponse(Long menuId, String menuName, Integer quantity, Integer unitPrice) {}
