import { describe, it, expect, beforeEach } from 'vitest';
import { getItem, setItem, removeItem } from '../../utils/storage';

beforeEach(() => localStorage.clear());

describe('storage', () => {
  it('setItem and getItem round-trip', () => {
    setItem('key', { a: 1 });
    expect(getItem('key', null)).toEqual({ a: 1 });
  });

  it('getItem returns fallback for missing key', () => {
    expect(getItem('missing', 'default')).toBe('default');
  });

  it('getItem returns fallback for invalid JSON', () => {
    localStorage.setItem('bad', '{invalid');
    expect(getItem('bad', [])).toEqual([]);
  });

  it('removeItem removes key', () => {
    setItem('key', 'val');
    removeItem('key');
    expect(getItem('key', null)).toBeNull();
  });
});
