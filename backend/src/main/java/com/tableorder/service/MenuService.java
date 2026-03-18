package com.tableorder.service;

import com.tableorder.dto.menu.*;
import com.tableorder.entity.Category;
import com.tableorder.entity.Menu;
import com.tableorder.repository.CategoryRepository;
import com.tableorder.repository.MenuRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MenuService {

    private final MenuRepository menuRepository;
    private final CategoryRepository categoryRepository;

    public MenuService(MenuRepository menuRepository, CategoryRepository categoryRepository) {
        this.menuRepository = menuRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public List<MenuResponse> getMenus(Long storeId, Long categoryId) {
        List<Menu> menus = (categoryId != null)
                ? menuRepository.findByStoreIdAndCategoryIdOrderByDisplayOrderAsc(storeId, categoryId)
                : menuRepository.findByStoreIdOrderByDisplayOrderAsc(storeId);
        return menus.stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public MenuResponse getMenuDetail(Long menuId) {
        Menu menu = menuRepository.findById(menuId)
                .orElseThrow(() -> new EntityNotFoundException("Menu not found"));
        return toResponse(menu);
    }

    @Transactional
    public MenuResponse createMenu(Long storeId, CreateMenuRequest request) {
        Menu menu = new Menu();
        menu.setStoreId(storeId);
        menu.setName(request.name());
        menu.setPrice(request.price());
        menu.setDescription(request.description());
        menu.setCategoryId(request.categoryId());
        menu.setImageUrl(request.imageUrl());
        menu.setDisplayOrder(request.displayOrder());
        return toResponse(menuRepository.save(menu));
    }

    @Transactional
    public MenuResponse updateMenu(Long menuId, UpdateMenuRequest request) {
        Menu menu = menuRepository.findById(menuId)
                .orElseThrow(() -> new EntityNotFoundException("Menu not found"));
        menu.setName(request.name());
        menu.setPrice(request.price());
        menu.setDescription(request.description());
        menu.setCategoryId(request.categoryId());
        menu.setImageUrl(request.imageUrl());
        menu.setDisplayOrder(request.displayOrder());
        return toResponse(menuRepository.save(menu));
    }

    @Transactional
    public void deleteMenu(Long menuId) {
        if (!menuRepository.existsById(menuId)) {
            throw new EntityNotFoundException("Menu not found");
        }
        menuRepository.deleteById(menuId);
    }

    @Transactional
    public void updateMenuOrder(Long storeId, List<MenuOrderRequest> requests) {
        for (MenuOrderRequest req : requests) {
            Menu menu = menuRepository.findById(req.menuId())
                    .orElseThrow(() -> new EntityNotFoundException("Menu not found: " + req.menuId()));
            menu.setDisplayOrder(req.displayOrder());
            menuRepository.save(menu);
        }
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> getCategories(Long storeId) {
        return categoryRepository.findByStoreIdOrderByDisplayOrderAsc(storeId).stream()
                .map(c -> new CategoryResponse(c.getId(), c.getName(), c.getDisplayOrder()))
                .toList();
    }

    private MenuResponse toResponse(Menu menu) {
        return new MenuResponse(menu.getId(), menu.getName(), menu.getPrice(),
                menu.getDescription(), menu.getImageUrl(), menu.getCategoryId(), menu.getDisplayOrder());
    }
}
