import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../store/CartContext';
import { useAuth } from '../store/AuthContext';
import { createOrder } from '../services/orderApi';
import { formatPrice } from '../utils/format';
import { CartSummary } from '../components/CartSummary';
import { ErrorMessage } from '../components/ErrorMessage';
import styles from './OrderConfirmPage.module.css';

export default function OrderConfirmPage() {
  const navigate = useNavigate();
  const { state: cart, dispatch: cartDispatch } = useCart();
  const { state: auth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    if (!auth.storeId || !auth.tableId || !auth.sessionId) return;
    setLoading(true);
    setError('');
    try {
      const order = await createOrder({
        storeId: auth.storeId,
        tableId: auth.tableId,
        sessionId: auth.sessionId,
        items: cart.items.map((i) => ({ menuId: i.menuId, menuName: i.menuName, quantity: i.quantity, unitPrice: i.unitPrice })),
        totalAmount: cart.totalAmount,
      });
      cartDispatch({ type: 'CLEAR' });
      navigate(`/order-success?orderNumber=${order.orderNumber}`, { replace: true });
    } catch {
      setError('주문에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0) {
    navigate('/cart', { replace: true });
    return null;
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>주문 확인</h1>
      {cart.items.map((item) => (
        <div key={item.menuId} className={styles.item}>
          <span>{item.menuName} × {item.quantity}</span>
          <span>{formatPrice(item.unitPrice * item.quantity)}</span>
        </div>
      ))}
      <CartSummary totalAmount={cart.totalAmount} itemCount={cart.items.reduce((s, i) => s + i.quantity, 0)} />
      {error && <ErrorMessage message={error} onRetry={handleConfirm} />}
      <button className={styles.confirmBtn} data-testid="order-confirm-submit" onClick={handleConfirm} disabled={loading}>
        {loading ? '주문 중...' : '주문 확정'}
      </button>
    </div>
  );
}
