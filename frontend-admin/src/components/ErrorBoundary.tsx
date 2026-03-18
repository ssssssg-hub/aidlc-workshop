import { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button } from '@mui/material';
import log from '../utils/logger';

interface Props { children: ReactNode }
interface State { hasError: boolean }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    log.error('Unhandled error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: 2 }}>
          <Typography variant="h5">오류가 발생했습니다</Typography>
          <Typography color="text.secondary">잠시 후 다시 시도해 주세요.</Typography>
          <Button variant="contained" onClick={() => window.location.reload()} data-testid="error-boundary-reload">
            새로고침
          </Button>
        </Box>
      );
    }
    return this.props.children;
  }
}
