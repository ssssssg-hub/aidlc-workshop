import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MenuCard } from '../../components/MenuCard';
import type { Menu } from '../../types';

const menu: Menu = { id: 1, name: '김치찌개', price: 9000, description: '맛있는 김치찌개', imageUrl: null, categoryId: 1, displayOrder: 0 };

describe('MenuCard', () => {
  it('renders menu name and price', () => {
    render(<MenuCard menu={menu} onDetail={vi.fn()} onAddToCart={vi.fn()} />);
    expect(screen.getByText('김치찌개')).toBeDefined();
    expect(screen.getByText('9,000원')).toBeDefined();
  });

  it('calls onAddToCart when + button clicked', () => {
    const onAdd = vi.fn();
    render(<MenuCard menu={menu} onDetail={vi.fn()} onAddToCart={onAdd} />);
    fireEvent.click(screen.getByTestId('menu-add-1'));
    expect(onAdd).toHaveBeenCalledWith(menu);
  });
});
