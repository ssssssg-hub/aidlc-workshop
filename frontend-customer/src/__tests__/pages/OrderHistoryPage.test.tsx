import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../store/AuthContext';

vi.mock('../../services/orderApi', () => ({
  getOrdersBySession: vi.fn().mockResolvedValue([]),
}));

import OrderHistoryPage from '../../pages/OrderHistoryPage';

describe('OrderHistoryPage', () => {
  it('shows empty message when no orders', async () => {
    render(
      <MemoryRouter>
        <AuthProvider><OrderHistoryPage /></AuthProvider>
      </MemoryRouter>,
    );
    await waitFor(() => expect(screen.getByText('주문 내역이 없습니다.')).toBeDefined());
  });
});
