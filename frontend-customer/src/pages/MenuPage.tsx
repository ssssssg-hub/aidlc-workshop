import { useState, useEffect, useCallback } from 'react';
import type { Category, Menu } from '../types';
import { getCategories, getMenus } from '../services/menuApi';
import { useCart } from '../store/CartContext';
import { CategoryTabs } from '../components/CategoryTabs';
import { MenuCard } from '../components/MenuCard';
import { MenuDetailModal } from '../components/MenuDetailModal';
import { RecommendationModal } from '../components/RecommendationModal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import styles from './MenuPage.module.css';

export default function MenuPage() {
  const { dispatch } = useCart();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [detailMenu, setDetailMenu] = useState<Menu | null>(null);
  const [showRec, setShowRec] = useState(false);

  useEffect(() => {
    getCategories()
      .then((cats) => {
        setCategories(cats);
        if (cats.length > 0) setSelectedCategory(cats[0]!.id);
      })
      .catch(() => setError('카테고리를 불러올 수 없습니다.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedCategory == null) return;
    setLoading(true);
    getMenus(selectedCategory)
      .then(setMenus)
      .catch(() => setError('메뉴를 불러올 수 없습니다.'))
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  const handleAddToCart = useCallback((menu: Menu) => {
    dispatch({ type: 'ADD_ITEM', payload: { menuId: menu.id, menuName: menu.name, unitPrice: menu.price } });
  }, [dispatch]);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>메뉴</h1>
        <button className={styles.recBtn} data-testid="menu-recommend-btn" onClick={() => setShowRec(true)}>메뉴 추천</button>
      </div>
      <CategoryTabs categories={categories} selectedId={selectedCategory} onSelect={setSelectedCategory} />
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} onRetry={() => { setError(''); setSelectedCategory(selectedCategory); }} />}
      <div className={styles.menuList}>
        {menus.map((m) => (
          <MenuCard key={m.id} menu={m} onDetail={setDetailMenu} onAddToCart={handleAddToCart} />
        ))}
      </div>
      {detailMenu && <MenuDetailModal menu={detailMenu} onClose={() => setDetailMenu(null)} onAddToCart={handleAddToCart} />}
      {showRec && <RecommendationModal onClose={() => setShowRec(false)} />}
    </div>
  );
}
