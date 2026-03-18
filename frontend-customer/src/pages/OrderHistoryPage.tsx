import { useState, useEffect } from 'react';
import type { Order } from '../types';
import { useAuth } from '../store/AuthContext';
import { getOrdersBySession } from '../services/orderApi';
import { OrderCard } from '../components/OrderCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import styles from './OrderHistoryPage.module.css';

export default function OrderHistoryPage() {
  const { state: auth } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    if (!auth.sessionId) { setLoading(false); return; }
    setLoading(true);
    setError('');
    getOrdersBySession(auth.sessionId)
      .then(setOrders)
      .catch(() => setError('주문 내역을 불러올 수 없습니다.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [auth.sessionId]);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>주문 내역</h1>
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} onRetry={load} />}
      {!loading && !error && orders.length === 0 && <p className={styles.empty}>주문 내역이 없습니다.</p>}
      {orders.map((o) => <OrderCard key={o.id} order={o} />)}
    </div>
  );
}
