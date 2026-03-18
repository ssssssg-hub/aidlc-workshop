/** Decode JWT and return exp (seconds). Returns null if invalid. */
export function jwtDecode(token: string): number | null {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded.exp ?? null;
  } catch {
    return null;
  }
}
