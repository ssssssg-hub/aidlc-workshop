import { memo } from 'react';
import type { CartItem as CartItemType } from '../types';
import { formatPrice } from '../utils/format';
import styles from './CartItem.module.css';

interface Props {
  item: CartItemType;
  onUpdateQuantity: (menuId: number, quantity: number) => void;
  onRemove: (menuId: number) => void;
}

export const CartItemRow = memo(function CartItemRow({ item, onUpdateQuantity, onRemove }: Props) {
  return (
    <div className={styles.item} data-testid={`cart-item-${item.menuId}`}>
      <div className={styles.info}>
        <p className={styles.name}>{item.menuName}</p>
        <p className={styles.subtotal}>{formatPrice(item.unitPrice)} × {item.quantity} = {formatPrice(item.unitPrice * item.quantity)}</p>
      </div>
      <div className={styles.controls}>
        <button className={styles.qtyBtn} data-testid={`cart-decrease-${item.menuId}`} onClick={() => onUpdateQuantity(item.menuId, item.quantity - 1)} aria-label="수량 감소">−</button>
        <span className={styles.qty}>{item.quantity}</span>
        <button className={styles.qtyBtn} data-testid={`cart-increase-${item.menuId}`} onClick={() => onUpdateQuantity(item.menuId, item.quantity + 1)} aria-label="수량 증가">+</button>
      </div>
      <button className={styles.removeBtn} data-testid={`cart-remove-${item.menuId}`} onClick={() => onRemove(item.menuId)} aria-label={`${item.menuName} 삭제`}>✕</button>
    </div>
  );
});
