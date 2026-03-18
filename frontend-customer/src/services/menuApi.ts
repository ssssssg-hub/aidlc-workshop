import { apiFetch } from './apiFetch';
import type { Category, Menu } from '../types';

export function getCategories(): Promise<Category[]> {
  return apiFetch('/api/categories');
}

export function getMenus(categoryId?: number): Promise<Menu[]> {
  const query = categoryId != null ? `?category=${categoryId}` : '';
  return apiFetch(`/api/menus${query}`);
}

export function getMenuDetail(menuId: number): Promise<Menu> {
  return apiFetch(`/api/menus/${menuId}`);
}
