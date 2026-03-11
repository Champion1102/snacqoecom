import { request } from './client';

export interface UserProfileResponse {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  birthday: string | null; // YYYY-MM-DD
  newsletter: boolean;
}

export function getProfile(): Promise<{ user: UserProfileResponse }> {
  return request('/api/users/me');
}

export function updateProfile(body: {
  firstName?: string;
  lastName?: string;
  phone?: string;
  birthday?: string | null;
  newsletter?: boolean;
}): Promise<{ user: UserProfileResponse }> {
  return request('/api/users/me', { method: 'PATCH', body });
}
