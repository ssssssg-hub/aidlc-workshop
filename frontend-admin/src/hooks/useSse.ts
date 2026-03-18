import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { createSseConnection } from '../services/sseService';
import {
  newOrderReceived,
  clearHighlight,
  orderStatusChanged,
  orderDeleted,
  tableReset,
} from '../features/orders/ordersSlice';
import type { SseEvent } from '../types';
import type { AppDispatch } from '../app/store';

export function useSse() {
  const dispatch = useDispatch<AppDispatch>();
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const handleEvent = (event: SseEvent) => {
      switch (event.type) {
        case 'NEW_ORDER':
          dispatch(newOrderReceived(event.order));
          setTimeout(() => dispatch(clearHighlight()), 2000);
          break;
        case 'ORDER_STATUS_CHANGED':
          dispatch(orderStatusChanged({ orderId: event.orderId, status: event.status }));
          break;
        case 'ORDER_DELETED':
          dispatch(orderDeleted({ orderId: event.orderId, tableId: event.tableId }));
          break;
        case 'PAYMENT_COMPLETED':
          dispatch(tableReset(event.tableId));
          break;
      }
    };

    esRef.current = createSseConnection(handleEvent);

    return () => {
      esRef.current?.close();
    };
  }, [dispatch]);
}
