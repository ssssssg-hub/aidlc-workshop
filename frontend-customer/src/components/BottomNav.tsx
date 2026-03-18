import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../store/CartContext';
import styles from './BottomNav.module.css';

const tabs = [
  { path: '/menu', label: '메뉴', icon: '🍽️' },
  { path: '/cart', label: '장바구니', icon: '🛒' },
  { path: '/orders', label: '주문내역', icon: '📋' },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { state } = useCart();
  const itemCount = state.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <nav className={styles.nav} aria-label="메인 네비게이션">
      {tabs.map((t) => (
        <button
          key={t.path}
          className={`${styles.tab} ${pathname.startsWith(t.path) ? styles.active : ''}`}
          data-testid={`nav-${t.label}`}
          onClick={() => navigate(t.path)}
          aria-current={pathname.startsWith(t.path) ? 'page' : undefined}
        >
          <span>{t.icon}</span>
          <span>{t.label}</span>
          {t.path === '/cart' && itemCount > 0 && (
            <span className={styles.badge} data-testid="cart-badge">{itemCount}</span>
          )}
        </button>
      ))}
    </nav>
  );
}
