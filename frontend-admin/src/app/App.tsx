import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { CssBaseline, CircularProgress, Box } from '@mui/material';
import { store } from './store';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { AuthGuard } from '../components/AuthGuard';
import { AppLayout } from '../components/AppLayout';
import { NotificationSnackbar } from '../components/NotificationSnackbar';

const LoginPage = lazy(() => import('../pages/LoginPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const MenuManagementPage = lazy(() => import('../pages/MenuManagementPage'));
const TableSetupPage = lazy(() => import('../pages/TableSetupPage'));

const Loading = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <CircularProgress />
  </Box>
);

export default function App() {
  return (
    <Provider store={store}>
      <CssBaseline />
      <ErrorBoundary>
        <BrowserRouter>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route element={<AuthGuard><AppLayout /></AuthGuard>}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/menus" element={<MenuManagementPage />} />
                <Route path="/tables/setup" element={<TableSetupPage />} />
              </Route>
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
          <NotificationSnackbar />
        </BrowserRouter>
      </ErrorBoundary>
    </Provider>
  );
}
