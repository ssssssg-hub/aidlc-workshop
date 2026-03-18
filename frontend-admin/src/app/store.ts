import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import ordersReducer from '../features/orders/ordersSlice';
import tablesReducer from '../features/tables/tablesSlice';
import menusReducer from '../features/menus/menusSlice';
import notificationReducer from '../features/notification/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    orders: ordersReducer,
    tables: tablesReducer,
    menus: menusReducer,
    notification: notificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
