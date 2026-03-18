import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CartProvider } from '../../store/CartContext';
import { BottomNav } from '../../components/BottomNav';

function renderNav() {
  return render(
    <MemoryRouter initialEntries={['/menu']}>
      <CartProvider><BottomNav /></CartProvider>
    </MemoryRouter>,
  );
}

describe('BottomNav', () => {
  it('renders 3 tabs', () => {
    renderNav();
    expect(screen.getByTestId('nav-메뉴')).toBeDefined();
    expect(screen.getByTestId('nav-장바구니')).toBeDefined();
    expect(screen.getByTestId('nav-주문내역')).toBeDefined();
  });
});
