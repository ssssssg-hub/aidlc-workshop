import { useEffect, useState, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box, Grid, Card, CardContent, Typography, Chip, IconButton,
  TextField, MenuItem, CardActionArea, keyframes,
} from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import HistoryIcon from '@mui/icons-material/History';
import { tableService } from '../services/tableService';
import { setTables } from '../features/tables/tablesSlice';
import { setAllOrders } from '../features/orders/ordersSlice';
import { showNotification } from '../features/notification/notificationSlice';
import { useSse } from '../hooks/useSse';
import { OrderDetailModal } from './dashboard/OrderDetailModal';
import { PaymentCompleteModal } from './dashboard/PaymentCompleteModal';
import { OrderHistoryModal } from './dashboard/OrderHistoryModal';
import type { RootState, AppDispatch } from '../app/store';
import type { Order, TableStatus } from '../types';
import log from '../utils/logger';

const pulse = keyframes`0%{background-color:#fff3e0}50%{background-color:#ffe0b2}100%{background-color:#fff3e0}`;

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const tables = useSelector((s: RootState) => s.tables.list);
  const ordersByTable = useSelector((s: RootState) => s.orders.byTableId);
  const highlightedTableId = useSelector((s: RootState) => s.orders.highlightedTableId);
  const [filterTableId, setFilterTableId] = useState<number | ''>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [paymentTableId, setPaymentTableId] = useState<number | null>(null);
  const [historyTableId, setHistoryTableId] = useState<number | null>(null);

  useSse();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await tableService.getTables();
        dispatch(setTables(data));
        const ordersMap: Record<number, Order[]> = {};
        data.forEach((t: TableStatus) => { ordersMap[t.id] = t.orders || []; });
        dispatch(setAllOrders(ordersMap));
      } catch (err) {
        log.error('Failed to load tables:', err);
        dispatch(showNotification({ message: '테이블 정보를 불러오지 못했습니다.', severity: 'error' }));
      }
    };
    load();
  }, [dispatch]);

  const filteredTables = useMemo(
    () => filterTableId ? tables.filter((t) => t.id === filterTableId) : tables,
    [tables, filterTableId],
  );

  const getTotalAmount = useCallback(
    (tableId: number) => (ordersByTable[tableId] || []).reduce((sum, o) => sum + o.totalAmount, 0),
    [ordersByTable],
  );

  const getLatestOrders = useCallback(
    (tableId: number) => [...(ordersByTable[tableId] || [])].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5),
    [ordersByTable],
  );

  const statusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'PREPARING': return 'info';
      case 'COMPLETED': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">주문 대시보드</Typography>
        <TextField
          select label="테이블 필터" size="small" sx={{ width: 200 }}
          value={filterTableId} onChange={(e) => setFilterTableId(e.target.value ? Number(e.target.value) : '')}
          data-testid="dashboard-table-filter"
        >
          <MenuItem value="">전체</MenuItem>
          {tables.map((t) => <MenuItem key={t.id} value={t.id}>테이블 {t.tableNumber}</MenuItem>)}
        </TextField>
      </Box>

      <Grid container spacing={2}>
        {filteredTables.map((table) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={table.id}>
            <Card
              sx={{
                height: '100%',
                animation: highlightedTableId === table.id ? `${pulse} 0.5s ease 4` : 'none',
              }}
              data-testid={`table-card-${table.tableNumber}`}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6">테이블 {table.tableNumber}</Typography>
                  <Box>
                    <IconButton size="small" onClick={() => setPaymentTableId(table.id)} data-testid={`payment-btn-${table.tableNumber}`} title="결제 완료">
                      <PaymentIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => setHistoryTableId(table.id)} data-testid={`history-btn-${table.tableNumber}`} title="과거 내역">
                      <HistoryIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Typography variant="subtitle1" color="primary" sx={{ mb: 1 }}>
                  총 {getTotalAmount(table.id).toLocaleString()}원
                </Typography>
                {getLatestOrders(table.id).map((order) => (
                  <CardActionArea key={order.id} onClick={() => setSelectedOrder(order)} data-testid={`order-preview-${order.id}`} sx={{ p: 0.5, mb: 0.5, borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">{order.orderNumber}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography variant="body2">{order.totalAmount.toLocaleString()}원</Typography>
                        <Chip label={order.status} size="small" color={statusColor(order.status) as 'warning' | 'info' | 'success' | 'default'} />
                      </Box>
                    </Box>
                  </CardActionArea>
                ))}
                {(ordersByTable[table.id] || []).length === 0 && (
                  <Typography variant="body2" color="text.secondary">주문 없음</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      <PaymentCompleteModal
        open={paymentTableId !== null}
        tableId={paymentTableId}
        totalAmount={paymentTableId ? getTotalAmount(paymentTableId) : 0}
        onClose={() => setPaymentTableId(null)}
      />
      <OrderHistoryModal
        open={historyTableId !== null}
        tableId={historyTableId}
        onClose={() => setHistoryTableId(null)}
      />
    </Box>
  );
}
