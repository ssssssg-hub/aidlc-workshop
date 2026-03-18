package com.tableorder.controller;

import com.tableorder.dto.table.*;
import com.tableorder.security.AuthDetails;
import com.tableorder.service.TableService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/admin/tables")
public class TableController {

    private final TableService tableService;

    public TableController(TableService tableService) {
        this.tableService = tableService;
    }

    @PostMapping
    public ResponseEntity<TableResponse> setupTable(@Valid @RequestBody SetupTableRequest request,
                                                     Authentication authentication) {
        Long storeId = getStoreId(authentication);
        return ResponseEntity.ok(tableService.setupTable(storeId, request));
    }

    @PostMapping("/{id}/payment-complete")
    public ResponseEntity<Void> completePayment(@PathVariable Long id) {
        tableService.completePayment(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<TableStatusResponse>> getTableStatuses(Authentication authentication) {
        Long storeId = getStoreId(authentication);
        return ResponseEntity.ok(tableService.getTableStatuses(storeId));
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<List<OrderHistoryResponse>> getOrderHistory(
            @PathVariable Long id,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(tableService.getOrderHistory(id, date));
    }

    private Long getStoreId(Authentication authentication) {
        return ((AuthDetails) authentication.getCredentials()).storeId();
    }
}
