import { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Table, TableBody, TableCell, TableHead, TableRow,
  Select, MenuItem, Typography, Box,
} from '@mui/material';
import { orderService } from '../../services/orderService';
import { orderStatusChanged, orderDeleted } from '../../features/orders/ordersSlice';
import { showNotification } from '../../features/notification/notificationSlice';
import type { Order, OrderStatus } from '../../types';
import type { AppDispatch } from '../../app/store';
import log from '../../utils/logger';

interface Props {
  order: Order | null;
  onClose: () => void;
}

export function OrderDetailModal({ order, onClose }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!order) return null;

  const handleStatusChange = async (status: OrderStatus) => {
    const prev = order.status;
    dispatch(orderStatusChanged({ orderId: order.id, status }));
    try {
      await orderService.updateOrderStatus(order.id, { status });
      dispatch(showNotification({ message: '주문 상태가 변경되었습니다.', severity: 'success' }));
    } catch (err) {
      dispatch(orderStatusChanged({ orderId: order.id, status: prev }));
      dispatch(showNotification({ message: '상태 변경에 실패했습니다.', severity: 'error' }));
      log.error('Status change failed:', err);
    }
  };

  const handleDelete = async () => {
    try {
      await orderService.deleteOrder(order.id);
      dispatch(orderDeleted({ orderId: order.id, tableId: order.tableId }));
      dispatch(showNotification({ message: '주문이 삭제되었습니다.', severity: 'success' }));
      setConfirmDelete(false);
      onClose();
    } catch (err) {
      dispatch(showNotification({ message: '주문 삭제에 실패했습니다.', severity: 'error' }));
      log.error('Delete failed:', err);
    }
  };

  return (
    <>
      <Dialog open={!!order} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>주문 상세 — {order.orderNumber}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body2">주문 시각: {new Date(order.createdAt).toLocaleString()}</Typography>
            <Select
              size="small" value={order.status}
              onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
              data-testid="order-status-select"
            >
              <MenuItem value="PENDING">대기중</MenuItem>
              <MenuItem value="PREPARING">준비중</MenuItem>
              <MenuItem value="COMPLETED">완료</MenuItem>
            </Select>
          </Box>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>메뉴</TableCell>
                <TableCell align="right">단가</TableCell>
                <TableCell align="right">수량</TableCell>
                <TableCell align="right">소계</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.menuName}</TableCell>
                  <TableCell align="right">{item.unitPrice.toLocaleString()}원</TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">{(item.unitPrice * item.quantity).toLocaleString()}원</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3}><strong>합계</strong></TableCell>
                <TableCell align="right"><strong>{order.totalAmount.toLocaleString()}원</strong></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={() => setConfirmDelete(true)} data-testid="order-delete-btn">주문 삭제</Button>
          <Button onClick={onClose}>닫기</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle>주문 삭제 확인</DialogTitle>
        <DialogContent>
          <Typography>주문 {order.orderNumber}을(를) 삭제하시겠습니까?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)}>취소</Button>
          <Button color="error" variant="contained" onClick={handleDelete} data-testid="order-delete-confirm">삭제</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
