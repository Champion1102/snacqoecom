import { request } from './client';

export interface CampusResponse {
  id: string;
  name: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  pincode: string;
}

export function getCampuses(): Promise<{ campuses: CampusResponse[] }> {
  return request('/api/campuses');
}
