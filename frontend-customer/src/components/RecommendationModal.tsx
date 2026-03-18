import { useState } from 'react';
import type { Recommendation, RecommendRequest } from '../types';
import { getRecommendation } from '../services/recommendApi';
import { useCart } from '../store/CartContext';
import { formatPrice } from '../utils/format';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import styles from './RecommendationModal.module.css';

interface Props { onClose: () => void; }

export function RecommendationModal({ onClose }: Props) {
  const { dispatch } = useCart();
  const [step, setStep] = useState<'input' | 'result'>('input');
  const [partySize, setPartySize] = useState(2);
  const [diningType, setDiningType] = useState<RecommendRequest['diningType']>('SHARE');
  const [results, setResults] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getRecommendation({ partySize, diningType });
      setResults(data);
      setStep('result');
    } catch {
      setError('추천을 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (rec: Recommendation) => {
    rec.items.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        dispatch({ type: 'ADD_ITEM', payload: { menuId: item.menuId, menuName: item.menuName, unitPrice: item.unitPrice } });
      }
    });
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose} data-testid="recommendation-overlay">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} data-testid="recommendation-close" onClick={onClose} aria-label="닫기">✕</button>
        <h2 className={styles.title}>AI 메뉴 추천</h2>

        {step === 'input' && (
          <>
            <div className={styles.field}>
              <label htmlFor="partySize">인원수</label>
              <input
                id="partySize" type="number" min={1} max={20} value={partySize}
                data-testid="recommendation-party-size"
                onChange={(e) => setPartySize(Math.max(1, Math.min(20, Number(e.target.value))))}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="diningType">식사 유형</label>
              <select
                id="diningType" value={diningType}
                data-testid="recommendation-dining-type"
                onChange={(e) => setDiningType(e.target.value as RecommendRequest['diningType'])}
              >
                <option value="SHARE">쉐어 (함께 나눠먹기)</option>
                <option value="INDIVIDUAL">단독 (각자 주문)</option>
              </select>
            </div>
            {error && <ErrorMessage message={error} onRetry={handleSubmit} />}
            {loading ? (
              <><LoadingSpinner /><p className={styles.loadingText}>추천 메뉴를 찾고 있어요...</p></>
            ) : (
              <button className={styles.submitBtn} data-testid="recommendation-submit" onClick={handleSubmit}>
                추천 받기
              </button>
            )}
          </>
        )}

        {step === 'result' && (
          <>
            {results.map((rec, idx) => (
              <div key={idx} className={styles.combo} data-testid={`recommendation-combo-${idx}`} onClick={() => handleSelect(rec)}>
                <p className={styles.comboTitle}>추천 {idx + 1}</p>
                {rec.items.map((item, i) => (
                  <p key={i} className={styles.comboItem}>{item.menuName} x{item.quantity}</p>
                ))}
                <p className={styles.comboTotal}>{formatPrice(rec.totalAmount)}</p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
