import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Box, Card, CardContent, TextField, Button, Typography, Alert } from '@mui/material';
import { loginSuccess } from '../features/auth/authSlice';
import { authService } from '../services/authService';
import log from '../utils/logger';
import type { AppDispatch } from '../app/store';

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [storeId, setStoreId] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeId || !username || !password) {
      setError('모든 필드를 입력해 주세요.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await authService.login({ storeId, username, password });
      dispatch(loginSuccess({ token: res.token, storeId }));
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || '로그인에 실패했습니다.';
      setError(msg);
      log.warn('Login failed:', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: 'grey.100' }}>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>관리자 로그인</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }} data-testid="login-error">{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="매장 식별자" value={storeId} onChange={(e) => setStoreId(e.target.value)} required data-testid="login-store-id" />
            <TextField label="사용자명" value={username} onChange={(e) => setUsername(e.target.value)} required data-testid="login-username" />
            <TextField label="비밀번호" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required data-testid="login-password" />
            <Button type="submit" variant="contained" size="large" disabled={loading} data-testid="login-submit">
              {loading ? '로그인 중...' : '로그인'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
