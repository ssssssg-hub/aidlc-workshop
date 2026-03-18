import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { jwtDecode } from './useJwtDecode';
import { logout } from '../features/auth/authSlice';
import type { RootState, AppDispatch } from '../app/store';

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const { token, isAuthenticated, storeId } = useSelector((s: RootState) => s.auth);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!token) return;
    const exp = jwtDecode(token);
    if (!exp) {
      dispatch(logout());
      return;
    }
    const ms = exp * 1000 - Date.now();
    if (ms <= 0) {
      dispatch(logout());
      return;
    }
    timerRef.current = setTimeout(() => dispatch(logout()), ms);
    return () => clearTimeout(timerRef.current);
  }, [token, dispatch]);

  return { isAuthenticated, storeId, logout: () => dispatch(logout()) };
}

// Minimal JWT exp extraction without external library
export { jwtDecode } from './useJwtDecode';
