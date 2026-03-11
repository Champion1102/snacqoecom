import { request } from './client';

export interface SettingsResponse {
  allowMultipleCoupons: boolean;
}

export function getSettings(): Promise<SettingsResponse> {
  return request<SettingsResponse>('/settings');
}
