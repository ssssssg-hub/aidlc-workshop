import log from '../utils/logger';
import { SseEvent } from '../types';

export function createSseConnection(
  onEvent: (event: SseEvent) => void,
  onError?: () => void,
): EventSource {
  const token = localStorage.getItem('token');
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
  const url = `${baseUrl}/admin/orders/stream${token ? `?token=${token}` : ''}`;

  const es = new EventSource(url);

  es.onmessage = (e) => {
    try {
      const data: SseEvent = JSON.parse(e.data);
      onEvent(data);
    } catch (err) {
      log.error('SSE parse error:', err);
    }
  };

  es.onerror = () => {
    log.warn('SSE connection error, will auto-reconnect');
    onError?.();
  };

  return es;
}
