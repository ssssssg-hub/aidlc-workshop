import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { AuthProvider, useAuth } from '../../store/AuthContext';

beforeEach(() => localStorage.clear());

function wrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

describe('AuthContext', () => {
  it('starts unauthenticated', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.state.isAuthenticated).toBe(false);
  });

  it('LOGIN sets authenticated state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    act(() => {
      result.current.dispatch({ type: 'LOGIN', payload: { token: 'tok', sessionId: 'sid', storeId: 'store', tableId: 1 } });
    });
    expect(result.current.state.isAuthenticated).toBe(true);
    expect(result.current.state.token).toBe('tok');
  });

  it('LOGOUT clears state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    act(() => {
      result.current.dispatch({ type: 'LOGIN', payload: { token: 'tok', sessionId: 'sid', storeId: 'store', tableId: 1 } });
    });
    act(() => { result.current.dispatch({ type: 'LOGOUT' }); });
    expect(result.current.state.isAuthenticated).toBe(false);
  });
});
