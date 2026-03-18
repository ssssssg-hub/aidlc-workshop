import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Card, CardContent, Typography, TextField, Button, Alert } from '@mui/material';
import { tableService } from '../services/tableService';
import { showNotification } from '../features/notification/notificationSlice';
import type { AppDispatch } from '../app/store';
import log from '../utils/logger';

export default function TableSetupPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [tableNumber, setTableNumber] = useState<number | ''>('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tableNumber || !password) {
      setResult({ success: false, message: '모든 필드를 입력해 주세요.' });
      return;
    }
    if (tableNumber <= 0) {
      setResult({ success: false, message: '테이블 번호는 양의 정수여야 합니다.' });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      await tableService.setupTable({ tableNumber: tableNumber as number, password });
      setResult({ success: true, message: `테이블 ${tableNumber} 설정이 완료되었습니다.` });
      dispatch(showNotification({ message: '테이블 설정 완료', severity: 'success' }));
      setTableNumber('');
      setPassword('');
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || '테이블 설정에 실패했습니다.';
      setResult({ success: false, message: msg });
      log.error('Table setup failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>테이블 초기 설정</Typography>
      <Card sx={{ maxWidth: 400 }}>
        <CardContent>
          {result && (
            <Alert severity={result.success ? 'success' : 'error'} sx={{ mb: 2 }} data-testid="table-setup-result">
              {result.message}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="테이블 번호" type="number" value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value ? Number(e.target.value) : '')}
              required inputProps={{ min: 1 }} data-testid="table-setup-number"
            />
            <TextField
              label="비밀번호" type="password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              required data-testid="table-setup-password"
            />
            <Button type="submit" variant="contained" disabled={loading} data-testid="table-setup-submit">
              {loading ? '설정 중...' : '테이블 설정'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
