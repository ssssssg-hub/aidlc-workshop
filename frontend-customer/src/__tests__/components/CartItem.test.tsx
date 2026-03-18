import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartItemRow } from '../../components/CartItem';
import type { CartItem } from '../../types';

const item: CartItem = { menuId: 1, menuName: '김치찌개', unitPrice: 9000, quantity: 2 };

describe('CartItemRow', () => {
  it('renders item info', () => {
    render(<CartItemRow item={item} onUpdateQuantity={vi.fn()} onRemove={vi.fn()} />);
    expect(screen.getByText('김치찌개')).toBeDefined();
    expect(screen.getByText('2')).toBeDefined();
  });

  it('calls onUpdateQuantity on + click', () => {
    const onUpdate = vi.fn();
    render(<CartItemRow item={item} onUpdateQuantity={onUpdate} onRemove={vi.fn()} />);
    fireEvent.click(screen.getByTestId('cart-increase-1'));
    expect(onUpdate).toHaveBeenCalledWith(1, 3);
  });

  it('calls onRemove on remove click', () => {
    const onRemove = vi.fn();
    render(<CartItemRow item={item} onUpdateQuantity={vi.fn()} onRemove={onRemove} />);
    fireEvent.click(screen.getByTestId('cart-remove-1'));
    expect(onRemove).toHaveBeenCalledWith(1);
  });
});
