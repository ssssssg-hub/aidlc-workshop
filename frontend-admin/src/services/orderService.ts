import api from './api';
import { Order, UpdateStatusRequest } from '../types';

export const orderService = {
  getOrdersByTable: (tableId: number) =>
    api.get<Order[]>('/admin/orders', { params: { tableId } }).then((r) => r.data),

  updateOrderStatus: (orderId: number, data: UpdateStatusRequest) =>
    api.put<Order>(`/admin/orders/${orderId}/status`, data).then((r) => r.data),

  deleteOrder: (orderId: number) =>
    api.delete(`/admin/orders/${orderId}`),
};
