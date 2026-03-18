package com.tableorder.dto.table;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SetupTableRequest(
        @NotNull Integer tableNumber,
        @NotBlank String password
) {}
