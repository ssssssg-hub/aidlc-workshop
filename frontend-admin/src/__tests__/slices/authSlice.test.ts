import { describe, it, expect } from 'vitest';
import authReducer, { loginSuccess, logout } from '../../features/auth/authSlice';

describe('authSlice', () => {
  const initial = { token: null, storeId: null, isAuthenticated: false };

  it('handles loginSuccess', () => {
    const state = authReducer(initial, loginSuccess({ token: 'abc', storeId: 'store1' }));
    expect(state.token).toBe('abc');
    expect(state.storeId).toBe('store1');
    expect(state.isAuthenticated).toBe(true);
  });

  it('handles logout', () => {
    const loggedIn = { token: 'abc', storeId: 'store1', isAuthenticated: true };
    const state = authReducer(loggedIn, logout());
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});
