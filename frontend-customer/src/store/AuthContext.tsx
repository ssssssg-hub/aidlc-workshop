import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { AuthState, AuthAction } from '../types';
import { getItem, setItem, removeItem } from '../utils/storage';
import { isTokenExpired } from '../utils/jwt';

const AuthContext = createContext<{ state: AuthState; dispatch: React.Dispatch<AuthAction> } | null>(null);

function authReducer(_state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN':
      return { ...action.payload, isAuthenticated: true };
    case 'LOGOUT':
      return { token: null, sessionId: null, storeId: null, tableId: null, isAuthenticated: false };
  }
}

function loadInitialState(): AuthState {
  const token = getItem<string | null>('auth_token', null);
  if (token && !isTokenExpired(token)) {
    return {
      token,
      sessionId: getItem<string | null>('session_id', null),
      storeId: getItem<string | null>('store_id', null),
      tableId: getItem<number | null>('table_id', null),
      isAuthenticated: true,
    };
  }
  return { token: null, sessionId: null, storeId: null, tableId: null, isAuthenticated: false };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, undefined, loadInitialState);

  useEffect(() => {
    if (state.isAuthenticated) {
      setItem('auth_token', state.token);
      setItem('session_id', state.sessionId);
      setItem('store_id', state.storeId);
      setItem('table_id', state.tableId);
    } else {
      removeItem('auth_token');
      removeItem('session_id');
      removeItem('store_id');
      removeItem('table_id');
    }
  }, [state]);

  return <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
