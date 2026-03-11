import { request } from '@/api/client';

export interface Campus {
  id: string;
  name: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export function getCampuses(): Promise<{ campuses: Campus[] }> {
  return request<{ campuses: Campus[] }>('/api/admin/campuses');
}

export function createCampus(body: {
  name: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  pincode: string;
  sortOrder?: number;
}): Promise<{ campus: Campus }> {
  return request<{ campus: Campus }>('/api/admin/campuses', {
    method: 'POST',
    body,
  });
}

export function updateCampus(
  id: string,
  body: {
    name?: string;
    line1?: string;
    line2?: string | null;
    city?: string;
    state?: string;
    pincode?: string;
    isActive?: boolean;
    sortOrder?: number;
  }
): Promise<{ campus: Campus }> {
  return request<{ campus: Campus }>(`/api/admin/campuses/${id}`, {
    method: 'PATCH',
    body,
  });
}

export function deleteCampus(id: string): Promise<void> {
  return request<void>(`/api/admin/campuses/${id}`, { method: 'DELETE' });
}
