import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { CartProvider, useCart } from '../../store/CartContext';

beforeEach(() => localStorage.clear());

function wrapper({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}

describe('CartContext', () => {
  it('starts with empty cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.state.items).toEqual([]);
    expect(result.current.state.totalAmount).toBe(0);
  });

  it('ADD_ITEM adds new item', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => { result.current.dispatch({ type: 'ADD_ITEM', payload: { menuId: 1, menuName: 'A', unitPrice: 1000 } }); });
    expect(result.current.state.items).toHaveLength(1);
    expect(result.current.state.totalAmount).toBe(1000);
  });

  it('ADD_ITEM increments quantity for existing item', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => { result.current.dispatch({ type: 'ADD_ITEM', payload: { menuId: 1, menuName: 'A', unitPrice: 1000 } }); });
    act(() => { result.current.dispatch({ type: 'ADD_ITEM', payload: { menuId: 1, menuName: 'A', unitPrice: 1000 } }); });
    expect(result.current.state.items[0]?.quantity).toBe(2);
    expect(result.current.state.totalAmount).toBe(2000);
  });

  it('UPDATE_QUANTITY to 0 removes item', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => { result.current.dispatch({ type: 'ADD_ITEM', payload: { menuId: 1, menuName: 'A', unitPrice: 1000 } }); });
    act(() => { result.current.dispatch({ type: 'UPDATE_QUANTITY', payload: { menuId: 1, quantity: 0 } }); });
    expect(result.current.state.items).toHaveLength(0);
  });

  it('CLEAR empties cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => { result.current.dispatch({ type: 'ADD_ITEM', payload: { menuId: 1, menuName: 'A', unitPrice: 1000 } }); });
    act(() => { result.current.dispatch({ type: 'CLEAR' }); });
    expect(result.current.state.items).toEqual([]);
    expect(result.current.state.totalAmount).toBe(0);
  });
});
