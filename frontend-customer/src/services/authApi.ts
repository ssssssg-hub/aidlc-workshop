import { apiFetch } from './apiFetch';
import type { TableLoginRequest, TableLoginResponse } from '../types';

export function loginTable(req: TableLoginRequest): Promise<TableLoginResponse> {
  return apiFetch('/api/table/auth/login', { method: 'POST', body: JSON.stringify(req) });
}
