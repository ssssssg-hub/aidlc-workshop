import api from './api';
import { LoginRequest, TokenResponse } from '../types';

export const authService = {
  login: (data: LoginRequest) =>
    api.post<TokenResponse>('/admin/auth/login', data).then((r) => r.data),
};
