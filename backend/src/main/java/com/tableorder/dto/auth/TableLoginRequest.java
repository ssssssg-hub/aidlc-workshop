package com.tableorder.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record TableLoginRequest(
        @NotBlank String storeIdentifier,
        @NotNull Integer tableNumber,
        @NotBlank String password
) {}
