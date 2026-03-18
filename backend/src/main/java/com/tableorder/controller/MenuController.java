package com.tableorder.controller;

import com.tableorder.dto.menu.CategoryResponse;
import com.tableorder.dto.menu.MenuResponse;
import com.tableorder.security.AuthDetails;
import com.tableorder.service.MenuService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class MenuController {

    private final MenuService menuService;

    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }

    @GetMapping("/menus")
    public ResponseEntity<List<MenuResponse>> getMenus(
            @RequestParam(required = false) Long category,
            Authentication authentication) {
        Long storeId = getStoreId(authentication);
        return ResponseEntity.ok(menuService.getMenus(storeId, category));
    }

    @GetMapping("/menus/{id}")
    public ResponseEntity<MenuResponse> getMenuDetail(@PathVariable Long id) {
        return ResponseEntity.ok(menuService.getMenuDetail(id));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryResponse>> getCategories(Authentication authentication) {
        Long storeId = getStoreId(authentication);
        return ResponseEntity.ok(menuService.getCategories(storeId));
    }

    private Long getStoreId(Authentication authentication) {
        return ((AuthDetails) authentication.getCredentials()).storeId();
    }
}
