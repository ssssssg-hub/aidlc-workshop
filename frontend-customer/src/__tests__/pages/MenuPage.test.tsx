import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../store/AuthContext';
import { CartProvider } from '../../store/CartContext';

vi.mock('../../services/menuApi', () => ({
  getCategories: vi.fn().mockResolvedValue([{ id: 1, name: '메인', displayOrder: 0 }]),
  getMenus: vi.fn().mockResolvedValue([{ id: 1, name: '김치찌개', price: 9000, description: null, imageUrl: null, categoryId: 1, displayOrder: 0 }]),
}));

import MenuPage from '../../pages/MenuPage';

function renderMenu() {
  return render(
    <MemoryRouter>
      <AuthProvider><CartProvider><MenuPage /></CartProvider></AuthProvider>
    </MemoryRouter>,
  );
}

describe('MenuPage', () => {
  it('renders menu recommend button', async () => {
    renderMenu();
    await waitFor(() => expect(screen.getByTestId('menu-recommend-btn')).toBeDefined());
  });

  it('renders menu cards after loading', async () => {
    renderMenu();
    await waitFor(() => expect(screen.getByText('김치찌개')).toBeDefined());
  });
});
