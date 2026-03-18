import { describe, it, expect } from 'vitest';
import { isTokenExpired } from '../../utils/jwt';

function makeToken(exp: number): string {
  const payload = btoa(JSON.stringify({ exp }));
  return `header.${payload}.signature`;
}

describe('isTokenExpired', () => {
  it('returns false for valid token', () => {
    const future = Math.floor(Date.now() / 1000) + 3600;
    expect(isTokenExpired(makeToken(future))).toBe(false);
  });

  it('returns true for expired token', () => {
    const past = Math.floor(Date.now() / 1000) - 3600;
    expect(isTokenExpired(makeToken(past))).toBe(true);
  });

  it('returns true for invalid token', () => {
    expect(isTokenExpired('invalid')).toBe(true);
  });
});
