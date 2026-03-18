import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CartProvider } from '../../store/CartContext';
import CartPage from '../../pages/CartPage';

function renderCart() {
  return render(
    <MemoryRouter>
      <CartProvider><CartPage /></CartProvider>
    </MemoryRouter>,
  );
}

describe('CartPage', () => {
  it('shows empty message when cart is empty', () => {
    renderCart();
    expect(screen.getByText('장바구니가 비어있습니다.')).toBeDefined();
  });
});
