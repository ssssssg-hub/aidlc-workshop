import type { Category } from '../types';
import styles from './CategoryTabs.module.css';

interface Props {
  categories: Category[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export function CategoryTabs({ categories, selectedId, onSelect }: Props) {
  return (
    <div className={styles.tabs} role="tablist" aria-label="메뉴 카테고리">
      {categories.map((c) => (
        <button
          key={c.id}
          role="tab"
          aria-selected={c.id === selectedId}
          className={`${styles.tab} ${c.id === selectedId ? styles.active : ''}`}
          data-testid={`category-tab-${c.id}`}
          onClick={() => onSelect(c.id)}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}
