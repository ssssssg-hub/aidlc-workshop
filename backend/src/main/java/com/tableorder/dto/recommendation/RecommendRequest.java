package com.tableorder.dto.recommendation;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record RecommendRequest(
        @NotNull @Min(1) @Max(20) Integer partySize,
        @NotNull DiningType diningType
) {
    public enum DiningType { SHARE, INDIVIDUAL }
}
