package com.tableorder.dto.recommendation;

import java.util.List;

public record RecommendationResponse(
        String combinationName,
        List<RecommendedMenuItem> items,
        Integer estimatedTotal
) {
    public record RecommendedMenuItem(Long menuId, String menuName, Integer quantity, Integer price) {}
}
