import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './OrderSuccessPage.module.css';

export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const orderNumber = params.get('orderNumber') ?? '';
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown <= 0) { navigate('/menu', { replace: true }); return; }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  return (
    <div className={styles.page}>
      <div className={styles.icon}>✅</div>
      <h1 className={styles.title}>주문이 완료되었습니다!</h1>
      <p className={styles.orderNum} data-testid="order-success-number">{orderNumber}</p>
      <p className={styles.countdown}>{countdown}초 후 메뉴 화면으로 이동합니다.</p>
    </div>
  );
}
