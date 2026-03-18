package com.tableorder.service;

import com.tableorder.dto.menu.CreateMenuRequest;
import com.tableorder.dto.menu.MenuResponse;
import com.tableorder.entity.Menu;
import com.tableorder.repository.CategoryRepository;
import com.tableorder.repository.MenuRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MenuServiceTest {

    @Mock private MenuRepository menuRepository;
    @Mock private CategoryRepository categoryRepository;

    @InjectMocks private MenuService menuService;

    @Test
    void getMenus_withCategory_returnsFilteredMenus() {
        Menu menu = new Menu();
        menu.setName("Burger");
        menu.setPrice(15000);
        when(menuRepository.findByStoreIdAndCategoryIdOrderByDisplayOrderAsc(1L, 1L))
                .thenReturn(List.of(menu));

        List<MenuResponse> result = menuService.getMenus(1L, 1L);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).name()).isEqualTo("Burger");
    }

    @Test
    void getMenus_withoutCategory_returnsAllMenus() {
        when(menuRepository.findByStoreIdOrderByDisplayOrderAsc(1L)).thenReturn(List.of());

        List<MenuResponse> result = menuService.getMenus(1L, null);

        assertThat(result).isEmpty();
    }

    @Test
    void createMenu_success() {
        when(menuRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        MenuResponse response = menuService.createMenu(1L,
                new CreateMenuRequest("Pizza", 20000, "Delicious", 1L, null, 0));

        assertThat(response.name()).isEqualTo("Pizza");
        assertThat(response.price()).isEqualTo(20000);
    }

    @Test
    void deleteMenu_notFound_throwsException() {
        when(menuRepository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> menuService.deleteMenu(99L))
                .isInstanceOf(EntityNotFoundException.class);
    }
}
