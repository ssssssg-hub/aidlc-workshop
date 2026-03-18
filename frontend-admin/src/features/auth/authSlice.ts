import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  storeId: string | null;
  isAuthenticated: boolean;
}

const token = localStorage.getItem('token');

const initialState: AuthState = {
  token,
  storeId: localStorage.getItem('storeId'),
  isAuthenticated: !!token,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ token: string; storeId: string }>) {
      state.token = action.payload.token;
      state.storeId = action.payload.storeId;
      state.isAuthenticated = true;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('storeId', action.payload.storeId);
    },
    logout(state) {
      state.token = null;
      state.storeId = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('storeId');
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
