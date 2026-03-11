import { request } from './client';

export function validateCoupon(
  code: string,
  subtotalPaise: number,
  options?: { isCampusOrder?: boolean; campusId?: string }
): Promise<{ valid: boolean; discountAmount?: number; freeShipping?: boolean; message: string }> {
  return request('/api/coupons/validate', {
    method: 'POST',
    body: {
      code: code.trim(),
      subtotal: subtotalPaise,
      ...(options?.isCampusOrder && { isCampusOrder: true }),
      ...(options?.campusId && { campusId: options.campusId }),
    },
  });
}
