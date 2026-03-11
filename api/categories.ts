import { request } from './client';

export interface CategoryResponse {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
}

export function getCategories(): Promise<{ categories: CategoryResponse[] }> {
  return request('/api/categories');
}
