import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order, OrderStatus } from '../../types';

interface OrdersState {
  byTableId: Record<number, Order[]>;
  highlightedTableId: number | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  byTableId: {},
  highlightedTableId: null,
  loading: false,
  error: null,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders(state, action: PayloadAction<{ tableId: number; orders: Order[] }>) {
      state.byTableId[action.payload.tableId] = action.payload.orders;
    },
    setAllOrders(state, action: PayloadAction<Record<number, Order[]>>) {
      state.byTableId = action.payload;
    },
    newOrderReceived(state, action: PayloadAction<Order>) {
      const order = action.payload;
      if (!state.byTableId[order.tableId]) {
        state.byTableId[order.tableId] = [];
      }
      state.byTableId[order.tableId].push(order);
      state.highlightedTableId = order.tableId;
    },
    clearHighlight(state) {
      state.highlightedTableId = null;
    },
    orderStatusChanged(state, action: PayloadAction<{ orderId: number; status: OrderStatus }>) {
      for (const orders of Object.values(state.byTableId)) {
        const order = orders.find((o) => o.id === action.payload.orderId);
        if (order) {
          order.status = action.payload.status;
          break;
        }
      }
    },
    orderDeleted(state, action: PayloadAction<{ orderId: number; tableId: number }>) {
      const { orderId, tableId } = action.payload;
      if (state.byTableId[tableId]) {
        state.byTableId[tableId] = state.byTableId[tableId].filter((o) => o.id !== orderId);
      }
    },
    tableReset(state, action: PayloadAction<number>) {
      state.byTableId[action.payload] = [];
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  setOrders,
  setAllOrders,
  newOrderReceived,
  clearHighlight,
  orderStatusChanged,
  orderDeleted,
  tableReset,
  setLoading,
  setError,
} = ordersSlice.actions;
export default ordersSlice.reducer;
