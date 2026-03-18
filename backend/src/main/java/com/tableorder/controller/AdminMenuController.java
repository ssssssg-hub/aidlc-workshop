package com.tableorder.controller;

import com.tableorder.dto.menu.*;
import com.tableorder.security.AuthDetails;
import com.tableorder.service.MenuService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/menus")
public class AdminMenuController {

    private final MenuService menuService;

    public AdminMenuController(MenuService menuService) {
        this.menuService = menuService;
    }

    @GetMapping
    public ResponseEntity<List<MenuResponse>> getMenus(
            @RequestParam(required = false) Long category,
            Authentication authentication) {
        Long storeId = getStoreId(authentication);
        return ResponseEntity.ok(menuService.getMenus(storeId, category));
    }

    @PostMapping
    public ResponseEntity<MenuResponse> createMenu(@Valid @RequestBody CreateMenuRequest request,
                                                    Authentication authentication) {
        Long storeId = getStoreId(authentication);
        return ResponseEntity.ok(menuService.createMenu(storeId, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MenuResponse> updateMenu(@PathVariable Long id,
                                                    @Valid @RequestBody UpdateMenuRequest request) {
        return ResponseEntity.ok(menuService.updateMenu(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMenu(@PathVariable Long id) {
        menuService.deleteMenu(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/order")
    public ResponseEntity<Void> updateMenuOrder(@Valid @RequestBody List<MenuOrderRequest> requests,
                                                 Authentication authentication) {
        Long storeId = getStoreId(authentication);
        menuService.updateMenuOrder(storeId, requests);
        return ResponseEntity.noContent().build();
    }

    private Long getStoreId(Authentication authentication) {
        return ((AuthDetails) authentication.getCredentials()).storeId();
    }
}
