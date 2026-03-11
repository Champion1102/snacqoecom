import { request } from '@/api/client';

export interface SettingsResponse {
  allowMultipleCoupons: boolean;
}

export function getSettings(): Promise<SettingsResponse> {
  return request<SettingsResponse>('/api/admin/settings');
}

export function updateSettings(body: { allowMultipleCoupons: boolean }): Promise<SettingsResponse> {
  return request<SettingsResponse>('/api/admin/settings', { method: 'PATCH', body });
}
