import { describe, it, expect } from 'vitest';
import ordersReducer, {
  newOrderReceived, clearHighlight, orderStatusChanged, orderDeleted, tableReset, setAllOrders,
} from '../../features/orders/ordersSlice';
import type { Order } from '../../types';

const mockOrder: Order = {
  id: 1, orderNumber: 'ORD-001', storeId: 1, tableId: 10, sessionId: 1,
  totalAmount: 15000, status: 'PENDING', items: [], createdAt: '', updatedAt: '',
};

describe('ordersSlice', () => {
  const initial = { byTableId: {}, highlightedTableId: null, loading: false, error: null };

  it('handles newOrderReceived', () => {
    const state = ordersReducer(initial, newOrderReceived(mockOrder));
    expect(state.byTableId[10]).toHaveLength(1);
    expect(state.highlightedTableId).toBe(10);
  });

  it('handles clearHighlight', () => {
    const prev = { ...initial, highlightedTableId: 10 };
    const state = ordersReducer(prev, clearHighlight());
    expect(state.highlightedTableId).toBeNull();
  });

  it('handles orderStatusChanged', () => {
    const prev = { ...initial, byTableId: { 10: [mockOrder] } };
    const state = ordersReducer(prev, orderStatusChanged({ orderId: 1, status: 'COMPLETED' }));
    expect(state.byTableId[10][0].status).toBe('COMPLETED');
  });

  it('handles orderDeleted', () => {
    const prev = { ...initial, byTableId: { 10: [mockOrder] } };
    const state = ordersReducer(prev, orderDeleted({ orderId: 1, tableId: 10 }));
    expect(state.byTableId[10]).toHaveLength(0);
  });

  it('handles tableReset', () => {
    const prev = { ...initial, byTableId: { 10: [mockOrder] } };
    const state = ordersReducer(prev, tableReset(10));
    expect(state.byTableId[10]).toHaveLength(0);
  });

  it('handles setAllOrders', () => {
    const state = ordersReducer(initial, setAllOrders({ 10: [mockOrder], 20: [] }));
    expect(state.byTableId[10]).toHaveLength(1);
    expect(state.byTableId[20]).toHaveLength(0);
  });
});
