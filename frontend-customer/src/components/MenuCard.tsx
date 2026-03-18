import { memo } from 'react';
import type { Menu } from '../types';
import { formatPrice } from '../utils/format';
import styles from './MenuCard.module.css';

const PLACEHOLDER = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect fill="%23f5f5f5" width="80" height="80"/></svg>';

interface Props {
  menu: Menu;
  onDetail: (menu: Menu) => void;
  onAddToCart: (menu: Menu) => void;
}

export const MenuCard = memo(function MenuCard({ menu, onDetail, onAddToCart }: Props) {
  return (
    <div className={styles.card} data-testid={`menu-card-${menu.id}`}>
      <img
        className={styles.image}
        src={menu.imageUrl ?? PLACEHOLDER}
        alt={menu.name}
        loading="lazy"
        onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
        onClick={() => onDetail(menu)}
      />
      <div className={styles.info} onClick={() => onDetail(menu)}>
        <p className={styles.name}>{menu.name}</p>
        <p className={styles.price}>{formatPrice(menu.price)}</p>
      </div>
      <button
        className={styles.addBtn}
        data-testid={`menu-add-${menu.id}`}
        onClick={(e) => { e.stopPropagation(); onAddToCart(menu); }}
        aria-label={`${menu.name} 장바구니에 추가`}
      >
        +
      </button>
    </div>
  );
});
