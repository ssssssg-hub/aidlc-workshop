import api from './api';
import { Menu, Category, CreateMenuRequest, UpdateMenuRequest, MenuOrderRequest } from '../types';

export const menuService = {
  getCategories: () =>
    api.get<Category[]>('/categories').then((r) => r.data),

  getMenusByCategory: (categoryId?: number) =>
    api.get<Menu[]>('/menus', { params: categoryId ? { category: categoryId } : {} }).then((r) => r.data),

  createMenu: (data: CreateMenuRequest) =>
    api.post<Menu>('/admin/menus', data).then((r) => r.data),

  updateMenu: (id: number, data: UpdateMenuRequest) =>
    api.put<Menu>(`/admin/menus/${id}`, data).then((r) => r.data),

  deleteMenu: (id: number) =>
    api.delete(`/admin/menus/${id}`),

  updateMenuOrder: (data: MenuOrderRequest[]) =>
    api.put('/admin/menus/order', data),
};
