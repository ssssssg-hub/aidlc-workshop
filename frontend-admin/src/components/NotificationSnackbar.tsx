import { Snackbar, Alert } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { hideNotification } from '../features/notification/notificationSlice';
import type { RootState } from '../app/store';

export function NotificationSnackbar() {
  const dispatch = useDispatch();
  const { open, message, severity } = useSelector((s: RootState) => s.notification);

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={() => dispatch(hideNotification())}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert severity={severity} onClose={() => dispatch(hideNotification())} data-testid="notification-alert">
        {message}
      </Alert>
    </Snackbar>
  );
}
