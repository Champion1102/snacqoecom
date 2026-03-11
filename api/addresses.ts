import { request } from './client';

export interface AddressResponse {
  id: string;
  label: string;
  name: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export function listAddresses(): Promise<{ addresses: AddressResponse[] }> {
  return request('/api/users/me/addresses');
}

export function createAddress(body: {
  label: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}): Promise<{ address: AddressResponse }> {
  return request('/api/users/me/addresses', { method: 'POST', body });
}

export function updateAddress(
  id: string,
  body: Partial<{
    label: string;
    name: string;
    phone: string;
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    pincode: string;
    isDefault: boolean;
  }>
): Promise<{ address: AddressResponse }> {
  return request(`/api/users/me/addresses/${id}`, { method: 'PATCH', body });
}

export function deleteAddress(id: string): Promise<void> {
  return request(`/api/users/me/addresses/${id}`, { method: 'DELETE' });
}

/** Map API address to frontend SavedAddress shape */
export function toSavedAddress(a: AddressResponse) {
  return {
    id: a.id,
    label: a.label,
    recipientName: a.name,
    line1: a.line1,
    line2: a.line2 ?? undefined,
    city: a.city,
    state: a.state,
    zip: a.pincode,
    country: 'India',
    phone: a.phone,
    isDefault: a.isDefault,
  };
}
