import { formatPrice } from '../utils/format';
import styles from './CartSummary.module.css';

interface Props { totalAmount: number; itemCount: number; }

export function CartSummary({ totalAmount, itemCount }: Props) {
  return (
    <div className={styles.summary} data-testid="cart-summary">
      <span className={styles.label}>총 {itemCount}개</span>
      <span className={styles.amount}>{formatPrice(totalAmount)}</span>
    </div>
  );
}
