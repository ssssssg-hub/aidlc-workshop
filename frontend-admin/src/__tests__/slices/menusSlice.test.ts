import { describe, it, expect } from 'vitest';
import menusReducer, {
  setMenus, setCategories, addMenu, updateMenu, removeMenu, reorderMenus,
} from '../../features/menus/menusSlice';
import type { Menu, Category } from '../../types';

const mockMenu: Menu = { id: 1, categoryId: 1, name: '김치찌개', price: 9000, description: null, imageUrl: null, displayOrder: 0 };
const mockMenu2: Menu = { id: 2, categoryId: 1, name: '된장찌개', price: 8000, description: null, imageUrl: null, displayOrder: 1 };

describe('menusSlice', () => {
  const initial = { list: [], categories: [], selectedCategory: null, loading: false, error: null };

  it('handles setMenus', () => {
    const state = menusReducer(initial, setMenus([mockMenu]));
    expect(state.list).toHaveLength(1);
  });

  it('handles setCategories', () => {
    const cat: Category = { id: 1, name: '찌개', displayOrder: 0 };
    const state = menusReducer(initial, setCategories([cat]));
    expect(state.categories).toHaveLength(1);
  });

  it('handles addMenu', () => {
    const prev = { ...initial, list: [mockMenu] };
    const state = menusReducer(prev, addMenu(mockMenu2));
    expect(state.list).toHaveLength(2);
  });

  it('handles updateMenu', () => {
    const prev = { ...initial, list: [mockMenu] };
    const updated = { ...mockMenu, price: 10000 };
    const state = menusReducer(prev, updateMenu(updated));
    expect(state.list[0].price).toBe(10000);
  });

  it('handles removeMenu', () => {
    const prev = { ...initial, list: [mockMenu, mockMenu2] };
    const state = menusReducer(prev, removeMenu(1));
    expect(state.list).toHaveLength(1);
    expect(state.list[0].id).toBe(2);
  });

  it('handles reorderMenus', () => {
    const reordered = [{ ...mockMenu2, displayOrder: 0 }, { ...mockMenu, displayOrder: 1 }];
    const prev = { ...initial, list: [mockMenu, mockMenu2] };
    const state = menusReducer(prev, reorderMenus(reordered));
    expect(state.list[0].id).toBe(2);
  });
});
