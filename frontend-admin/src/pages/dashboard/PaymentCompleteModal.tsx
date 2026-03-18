import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { tableService } from '../../services/tableService';
import { tableReset } from '../../features/orders/ordersSlice';
import { showNotification } from '../../features/notification/notificationSlice';
import type { AppDispatch } from '../../app/store';
import log from '../../utils/logger';

interface Props {
  open: boolean;
  tableId: number | null;
  totalAmount: number;
  onClose: () => void;
}

export function PaymentCompleteModal({ open, tableId, totalAmount, onClose }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!tableId) return;
    setLoading(true);
    try {
      await tableService.completePayment(tableId);
      dispatch(tableReset(tableId));
      dispatch(showNotification({ message: '결제가 완료되었습니다.', severity: 'success' }));
      onClose();
    } catch (err) {
      dispatch(showNotification({ message: '결제 완료 처리에 실패했습니다.', severity: 'error' }));
      log.error('Payment complete failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>결제 완료 확인</DialogTitle>
      <DialogContent>
        <Typography variant="h6" sx={{ my: 2 }}>
          총 주문 금액: {totalAmount.toLocaleString()}원
        </Typography>
        <Typography color="text.secondary">
          결제 완료 시 해당 테이블의 모든 주문이 이력으로 이동되고 테이블이 초기화됩니다.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button variant="contained" onClick={handleConfirm} disabled={loading} data-testid="payment-confirm-btn">
          {loading ? '처리 중...' : '결제 완료 확정'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
