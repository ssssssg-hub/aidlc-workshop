import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiFetch, ApiError } from '../../services/apiFetch';

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('apiFetch', () => {
  it('makes GET request and returns JSON', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    const result = await apiFetch('/api/test');
    expect(result).toEqual({ ok: true });
  });

  it('attaches Authorization header when token exists', async () => {
    const futureExp = Math.floor(Date.now() / 1000) + 3600;
    const token = `h.${btoa(JSON.stringify({ exp: futureExp }))}.s`;
    localStorage.setItem('auth_token', JSON.stringify(token));

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{}', { status: 200 }));
    await apiFetch('/api/test');

    const call = vi.mocked(fetch).mock.calls[0]!;
    const headers = call[1]?.headers as Record<string, string>;
    expect(headers['Authorization']).toBe(`Bearer ${token}`);
  });

  it('throws ApiError on 4xx', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('Bad Request', { status: 400 }));
    await expect(apiFetch('/api/test')).rejects.toBeInstanceOf(ApiError);
  });
});
