import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { loginTable } from '../services/authApi';
import { ErrorMessage } from '../components/ErrorMessage';
import styles from './SetupPage.module.css';

export default function SetupPage() {
  const navigate = useNavigate();
  const { dispatch } = useAuth();
  const [storeIdentifier, setStoreIdentifier] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const valid = storeIdentifier.trim() && tableNumber.trim() && password.trim() && Number(tableNumber) > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    setLoading(true);
    setError('');
    try {
      const res = await loginTable({ storeIdentifier: storeIdentifier.trim(), tableNumber: Number(tableNumber), password });
      dispatch({ type: 'LOGIN', payload: { token: res.token, sessionId: res.sessionId, storeId: storeIdentifier.trim(), tableId: Number(tableNumber) } });
      navigate('/menu', { replace: true });
    } catch {
      setError('로그인에 실패했습니다. 정보를 확인해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>테이블 설정</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="storeId">매장 식별자</label>
          <input id="storeId" data-testid="setup-store-id" value={storeIdentifier} onChange={(e) => setStoreIdentifier(e.target.value)} required />
        </div>
        <div className={styles.field}>
          <label htmlFor="tableNum">테이블 번호</label>
          <input id="tableNum" type="number" min={1} data-testid="setup-table-number" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} required />
        </div>
        <div className={styles.field}>
          <label htmlFor="pwd">비밀번호</label>
          <input id="pwd" type="password" data-testid="setup-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <ErrorMessage message={error} />}
        <button className={styles.submitBtn} type="submit" data-testid="setup-submit" disabled={!valid || loading}>
          {loading ? '설정 중...' : '설정 완료'}
        </button>
      </form>
    </div>
  );
}
