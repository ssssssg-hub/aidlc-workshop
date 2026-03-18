import type { Menu } from '../types';
import { formatPrice } from '../utils/format';
import styles from './MenuDetailModal.module.css';

const PLACEHOLDER = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="240"><rect fill="%23f5f5f5" width="320" height="240"/></svg>';

interface Props {
  menu: Menu;
  onClose: () => void;
  onAddToCart: (menu: Menu) => void;
}

export function MenuDetailModal({ menu, onClose, onAddToCart }: Props) {
  return (
    <div className={styles.overlay} onClick={onClose} data-testid="menu-detail-overlay">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} style={{ position: 'relative' }}>
        <button className={styles.closeBtn} data-testid="menu-detail-close" onClick={onClose} aria-label="닫기">✕</button>
        <img
          className={styles.image}
          src={menu.imageUrl ?? PLACEHOLDER}
          alt={menu.name}
          onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
        />
        <h2 className={styles.name}>{menu.name}</h2>
        <p className={styles.price}>{formatPrice(menu.price)}</p>
        {menu.description && <p className={styles.desc}>{menu.description}</p>}
        <button
          className={styles.addBtn}
          data-testid="menu-detail-add"
          onClick={() => { onAddToCart(menu); onClose(); }}
        >
          장바구니에 추가
        </button>
      </div>
    </div>
  );
}
