import { getItem, removeItem } from '../utils/storage';
import { isTokenExpired } from '../utils/jwt';

const TIMEOUT_MS = 30_000;

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getItem<string | null>('auth_token', null);

  if (token && isTokenExpired(token)) {
    clearAuth();
    window.location.href = '/setup';
    throw new ApiError(401, '세션이 만료되었습니다.');
  }

  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...options.headers as Record<string, string> };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const doFetch = async (): Promise<Response> => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      return await fetch(path, { ...options, headers, signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }
  };

  let res: Response;
  try {
    res = await doFetch();
  } catch {
    // 1회 자동 재시도
    try {
      res = await doFetch();
    } catch {
      throw new ApiError(0, '네트워크 연결을 확인해 주세요.');
    }
  }

  if (res.status === 401) {
    clearAuth();
    window.location.href = '/setup';
    throw new ApiError(401, '인증이 필요합니다.');
  }

  if (res.status >= 500) {
    // 5xx 1회 재시도
    try {
      res = await doFetch();
    } catch {
      throw new ApiError(res.status, '서버 오류가 발생했습니다.');
    }
    if (!res.ok) throw new ApiError(res.status, '서버 오류가 발생했습니다.');
  }

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new ApiError(res.status, body || '요청 처리에 실패했습니다.');
  }

  const text = await res.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

function clearAuth() {
  removeItem('auth_token');
  removeItem('session_id');
  removeItem('store_id');
  removeItem('table_id');
}
