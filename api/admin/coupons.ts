import { request } from '@/api/client';

export type CouponType = 'PERCENT' | 'FIXED' | 'FREE_SHIPPING';

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  minOrderAmount: number | null;
  maxUses: number | null;
  usedCount: number;
  validFrom: string;
  validTo: string;
  isActive: boolean;
  campusOnly: boolean;
  allowedCampusIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CouponListResponse {
  coupons: Coupon[];
}

export function getCoupons(): Promise<CouponListResponse> {
  return request<CouponListResponse>('/api/admin/coupons');
}

export interface CreateCouponBody {
  code: string;
  type: CouponType;
  value: number; // 0 for FREE_SHIPPING
  minOrderAmount?: number | null;
  maxUses?: number | null;
  validFrom: string;
  validTo: string;
  campusOnly?: boolean;
  allowedCampusIds?: string[];
}

export function createCoupon(body: CreateCouponBody): Promise<{ coupon: Coupon }> {
  return request<{ coupon: Coupon }>('/api/admin/coupons', {
    method: 'POST',
    body: {
      code: body.code,
      type: body.type,
      value: body.value,
      minOrderAmount: body.minOrderAmount ?? null,
      maxUses: body.maxUses ?? null,
      validFrom: body.validFrom,
      validTo: body.validTo,
      campusOnly: body.campusOnly ?? false,
      allowedCampusIds: body.allowedCampusIds ?? [],
    },
  });
}

export interface UpdateCouponBody {
  code?: string;
  type?: CouponType;
  value?: number;
  minOrderAmount?: number | null;
  maxUses?: number | null;
  validFrom?: string;
  validTo?: string;
  isActive?: boolean;
  campusOnly?: boolean;
  allowedCampusIds?: string[];
}

export function updateCoupon(id: string, body: UpdateCouponBody): Promise<{ coupon: Coupon }> {
  return request<{ coupon: Coupon }>(`/api/admin/coupons/${id}`, {
    method: 'PATCH',
    body: body as Record<string, unknown>,
  });
}

/** Deactivate (isActive false) by default; pass true to hard-delete. */
export function deleteCoupon(id: string, hardDelete = false): Promise<void> {
  const qs = hardDelete ? '?delete=true' : '';
  return request<void>(`/api/admin/coupons/${id}${qs}`, { method: 'DELETE' });
}
