import { describe, it, expect } from 'vitest';
import tablesReducer, { setTables, setLoading, setError } from '../../features/tables/tablesSlice';
import type { TableStatus } from '../../types';

const mockTable: TableStatus = { id: 1, tableNumber: 1, activeSessionId: null, orders: [], totalAmount: 0 };

describe('tablesSlice', () => {
  const initial = { list: [], loading: false, error: null };

  it('handles setTables', () => {
    const state = tablesReducer(initial, setTables([mockTable]));
    expect(state.list).toHaveLength(1);
  });

  it('handles setLoading', () => {
    const state = tablesReducer(initial, setLoading(true));
    expect(state.loading).toBe(true);
  });

  it('handles setError', () => {
    const state = tablesReducer(initial, setError('fail'));
    expect(state.error).toBe('fail');
  });
});
