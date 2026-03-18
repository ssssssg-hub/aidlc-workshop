import { apiFetch } from './apiFetch';
import type { RecommendRequest, Recommendation } from '../types';

export function getRecommendation(req: RecommendRequest): Promise<Recommendation[]> {
  return apiFetch('/api/recommendations', { method: 'POST', body: JSON.stringify(req) });
}
