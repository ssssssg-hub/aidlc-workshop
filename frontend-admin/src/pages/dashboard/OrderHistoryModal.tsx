import { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Table, TableBody, TableCell, TableHead, TableRow, Typography, Box,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { tableService } from '../../services/tableService';
import type { OrderHistory } from '../../types';
import log from '../../utils/logger';

interface Props {
  open: boolean;
  tableId: number | null;
  onClose: () => void;
}

export function OrderHistoryModal({ open, tableId, onClose }: Props) {
  const [history, setHistory] = useState<OrderHistory[]>([]);
  const [dateFilter, setDateFilter] = useState<Dayjs | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !tableId) return;
    const load = async () => {
      setLoading(true);
      try {
        const date = dateFilter ? dateFilter.format('YYYY-MM-DD') : undefined;
        const data = await tableService.getOrderHistory(tableId, date);
        setHistory(data);
      } catch (err) {
        log.error('Failed to load order history:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [open, tableId, dateFilter]);

  const handleClose = () => {
    setHistory([]);
    setDateFilter(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>과거 주문 내역</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="날짜 필터"
              value={dateFilter}
              onChange={setDateFilter}
              slotProps={{ textField: { size: 'small', 'data-testid': 'history-date-filter' } as Record<string, unknown> }}
            />
          </LocalizationProvider>
        </Box>
        {loading ? (
          <Typography>로딩 중...</Typography>
        ) : history.length === 0 ? (
          <Typography color="text.secondary">과거 주문 내역이 없습니다.</Typography>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>주문 번호</TableCell>
                <TableCell>주문 시각</TableCell>
                <TableCell>메뉴</TableCell>
                <TableCell align="right">총 금액</TableCell>
                <TableCell>이용 완료</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((h) => (
                <TableRow key={h.id}>
                  <TableCell>{h.orderNumber}</TableCell>
                  <TableCell>{dayjs(h.orderedAt).format('YYYY-MM-DD HH:mm')}</TableCell>
                  <TableCell>{h.items.map((i) => `${i.menuName}x${i.quantity}`).join(', ')}</TableCell>
                  <TableCell align="right">{h.totalAmount.toLocaleString()}원</TableCell>
                  <TableCell>{dayjs(h.completedAt).format('YYYY-MM-DD HH:mm')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} data-testid="history-close-btn">닫기</Button>
      </DialogActions>
    </Dialog>
  );
}
