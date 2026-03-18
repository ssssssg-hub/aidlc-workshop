import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../store/AuthContext';

vi.mock('../../services/authApi', () => ({
  loginTable: vi.fn().mockRejectedValue(new Error('fail')),
}));

import SetupPage from '../../pages/SetupPage';

function renderSetup() {
  return render(
    <MemoryRouter>
      <AuthProvider><SetupPage /></AuthProvider>
    </MemoryRouter>,
  );
}

describe('SetupPage', () => {
  it('renders form fields', () => {
    renderSetup();
    expect(screen.getByTestId('setup-store-id')).toBeDefined();
    expect(screen.getByTestId('setup-table-number')).toBeDefined();
    expect(screen.getByTestId('setup-password')).toBeDefined();
  });

  it('submit button disabled when fields empty', () => {
    renderSetup();
    expect((screen.getByTestId('setup-submit') as HTMLButtonElement).disabled).toBe(true);
  });

  it('submit button enabled when fields filled', () => {
    renderSetup();
    fireEvent.change(screen.getByTestId('setup-store-id'), { target: { value: 'store1' } });
    fireEvent.change(screen.getByTestId('setup-table-number'), { target: { value: '1' } });
    fireEvent.change(screen.getByTestId('setup-password'), { target: { value: 'pass' } });
    expect((screen.getByTestId('setup-submit') as HTMLButtonElement).disabled).toBe(false);
  });
});
