import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../store/CartContext';
import { CartItemRow } from '../components/CartItem';
import { CartSummary } from '../components/CartSummary';
import styles from './CartPage.module.css';

export default function CartPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useCart();

  const handleUpdate = useCallback((menuId: number, qty: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { menuId, quantity: qty } });
  }, [dispatch]);

  const handleRemove = useCallback((menuId: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { menuId } });
  }, [dispatch]);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>장바구니</h1>
      {state.items.length === 0 ? (
        <p className={styles.empty}>장바구니가 비어있습니다.</p>
      ) : (
        <>
          {state.items.map((item) => (
            <CartItemRow key={item.menuId} item={item} onUpdateQuantity={handleUpdate} onRemove={handleRemove} />
          ))}
          <CartSummary totalAmount={state.totalAmount} itemCount={state.items.reduce((s, i) => s + i.quantity, 0)} />
          <div className={styles.actions}>
            <button className={styles.clearBtn} data-testid="cart-clear" onClick={() => dispatch({ type: 'CLEAR' })}>비우기</button>
            <button className={styles.orderBtn} data-testid="cart-order" onClick={() => navigate('/order-confirm')}>주문하기</button>
          </div>
        </>
      )}
    </div>
  );
}
