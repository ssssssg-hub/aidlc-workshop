import { apiFetch } from './apiFetch';
import type { CreateOrderRequest, Order } from '../types';

export function createOrder(req: CreateOrderRequest): Promise<Order> {
  return apiFetch('/api/orders', { method: 'POST', body: JSON.stringify(req) });
}

export function getOrdersBySession(sessionId: string): Promise<Order[]> {
  return apiFetch(`/api/orders?sessionId=${sessionId}`);
}
