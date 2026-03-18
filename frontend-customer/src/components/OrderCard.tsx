import { memo } from 'react';
import type { Order } from '../types';
import { formatPrice } from '../utils/format';
import styles from './OrderCard.module.css';

const STATUS_LABEL: Record<string, string> = { PENDING: '대기중', PREPARING: '준비중', COMPLETED: '완료' };

interface Props { order: Order; }

export const OrderCard = memo(function OrderCard({ order }: Props) {
  return (
    <div className={styles.card} data-testid={`order-card-${order.orderNumber}`}>
      <div className={styles.header}>
        <p className={styles.orderNum}>{order.orderNumber}</p>
        <span className={`${styles.status} ${styles[order.status]}`}>{STATUS_LABEL[order.status]}</span>
      </div>
      <span className={styles.time}>{new Date(order.createdAt).toLocaleTimeString('ko-KR')}</span>
      {order.items.map((item, i) => (
        <p key={i} className={styles.itemRow}>{item.menuName} × {item.quantity}</p>
      ))}
      <p className={styles.total}>{formatPrice(order.totalAmount)}</p>
    </div>
  );
});
