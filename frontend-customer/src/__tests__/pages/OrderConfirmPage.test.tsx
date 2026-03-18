import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CartProvider } from '../../store/CartContext';
import { AuthProvider } from '../../store/AuthContext';
import OrderConfirmPage from '../../pages/OrderConfirmPage';

describe('OrderConfirmPage', () => {
  it('redirects to cart when cart is empty', () => {
    render(
      <MemoryRouter initialEntries={['/order-confirm']}>
        <AuthProvider><CartProvider><OrderConfirmPage /></CartProvider></AuthProvider>
      </MemoryRouter>,
    );
    // empty cart → renders null (redirect)
    expect(screen.queryByText('주문 확인')).toBeNull();
  });
});
