import { request } from '@/api/client';

export interface Category {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  _count: { products: number };
}

export interface CategoryListResponse {
  categories: Category[];
}

export function getCategories(): Promise<CategoryListResponse> {
  return request<CategoryListResponse>('/api/admin/categories');
}

export function createCategory(body: {
  name: string;
  slug: string;
  sortOrder?: number;
}): Promise<{ category: Category }> {
  return request<{ category: Category }>('/api/admin/categories', {
    method: 'POST',
    body: { name: body.name, slug: body.slug, sortOrder: body.sortOrder ?? 0 },
  });
}

export function updateCategory(
  id: string,
  body: { name?: string; slug?: string; sortOrder?: number }
): Promise<{ category: Category }> {
  return request<{ category: Category }>(`/api/admin/categories/${id}`, {
    method: 'PATCH',
    body,
  });
}

export function deleteCategory(id: string): Promise<void> {
  return request<void>(`/api/admin/categories/${id}`, { method: 'DELETE' });
}
