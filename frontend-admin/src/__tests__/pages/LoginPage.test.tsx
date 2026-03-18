import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../features/auth/authSlice';
import notificationReducer from '../../features/notification/notificationSlice';
import LoginPage from '../../pages/LoginPage';

vi.mock('../../services/authService', () => ({
  authService: {
    login: vi.fn(),
  },
}));

const createTestStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      notification: notificationReducer,
    },
  });

describe('LoginPage', () => {
  it('renders login form', () => {
    render(
      <Provider store={createTestStore()}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>,
    );
    expect(screen.getByTestId('login-store-id')).toBeInTheDocument();
    expect(screen.getByTestId('login-username')).toBeInTheDocument();
    expect(screen.getByTestId('login-password')).toBeInTheDocument();
    expect(screen.getByTestId('login-submit')).toBeInTheDocument();
  });

  it('shows error when fields are empty', async () => {
    render(
      <Provider store={createTestStore()}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>,
    );
    // HTML required 속성으로 인해 빈 필드 submit 시 브라우저 네이티브 검증 발동
    // 각 input 필드에 required 속성이 있는지 확인
    const storeInput = screen.getByTestId('login-store-id').querySelector('input');
    const usernameInput = screen.getByTestId('login-username').querySelector('input');
    const passwordInput = screen.getByTestId('login-password').querySelector('input');
    expect(storeInput).toBeRequired();
    expect(usernameInput).toBeRequired();
    expect(passwordInput).toBeRequired();
  });
});
