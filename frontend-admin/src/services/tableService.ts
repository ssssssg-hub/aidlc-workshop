import api from './api';
import { TableStatus, SetupTableRequest, TableResponse, OrderHistory } from '../types';

export const tableService = {
  getTables: () =>
    api.get<TableStatus[]>('/admin/tables').then((r) => r.data),

  setupTable: (data: SetupTableRequest) =>
    api.post<TableResponse>('/admin/tables', data).then((r) => r.data),

  completePayment: (tableId: number) =>
    api.post(`/admin/tables/${tableId}/payment-complete`),

  getOrderHistory: (tableId: number, date?: string) =>
    api.get<OrderHistory[]>(`/admin/tables/${tableId}/history`, { params: date ? { date } : {} }).then((r) => r.data),
};
