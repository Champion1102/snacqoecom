import { request, requestFormData } from './client';

export interface OrderItemResponse {
  id: string;
  variantId: string;
  productName: string;
  variantName: string;
  quantity: number;
  price: number;
  total: number;
  variant?: {
    id: string;
    name: string;
    sku: string;
    price: number;
    product: {
      id: string;
      slug: string;
      name: string;
      images?: { url: string }[];
    };
  };
}

export interface OrderResponse {
  id: string;
  orderNumber: string;
  userId: string | null;
  email: string;
  status: string;
  deliveryType?: string;
  campusId?: string | null;
  campus?: { id: string; name: string; line1: string; city: string; state: string; pincode: string } | null;
  subtotal: number;
  shippingAmount: number;
  discountAmount: number;
  total: number;
  currency: string;
  shippingName: string;
  shippingPhone: string;
  shippingLine1: string;
  shippingLine2: string | null;
  shippingCity: string;
  shippingState: string;
  shippingPincode: string;
  razorpayPaymentId?: string | null;
  razorpayOrderId?: string | null;
  razorpayPaymentStatus?: string | null; // Razorpay: captured | failed | authorized | created | refunded
  createdAt: string;
  items?: OrderItemResponse[];
  _count?: { items: number };
  review?: { id: string } | null;
}

export interface OrderReviewResponse {
  id: string;
  rating: number | null;
  text: string | null;
  imageUrls: string[];
  videoUrl: string | null;
  reviewerFirstName: string | null;
  reviewerLastName: string | null;
  createdAt: string;
}

export function getOrderReview(orderId: string): Promise<{ review: OrderReviewResponse | null }> {
  return request(`/api/orders/${encodeURIComponent(orderId)}/review`);
}

export function submitOrderReview(
  orderId: string,
  data: { rating?: number; text?: string; images?: File[]; video?: File }
): Promise<{ success: boolean }> {
  const formData = new FormData();
  if (data.rating != null && data.rating >= 1 && data.rating <= 5) formData.append('rating', String(data.rating));
  if (data.text != null && data.text.trim() !== '') formData.append('text', data.text.trim());
  (data.images ?? []).forEach((file) => formData.append('images', file));
  if (data.video) formData.append('video', data.video);
  return requestFormData(`/api/orders/${encodeURIComponent(orderId)}/review`, formData);
}

export function createOrder(body: {
  email: string;
  deliveryType?: 'STANDARD' | 'CAMPUS';
  campusId?: string;
  shippingName: string;
  shippingPhone: string;
  shippingLine1?: string;
  shippingLine2?: string | null;
  shippingCity?: string;
  shippingState?: string;
  shippingPincode?: string;
  couponCode?: string;
  couponCodes?: string[];
}): Promise<{ order: OrderResponse; razorpayOrderId: string | null }> {
  return request('/api/orders', { method: 'POST', body });
}

export interface CreatePaymentOrderResponse {
  razorpayOrderId: string;
  key: string;
  amount: number;
  currency: string;
}

export function createPaymentOrder(orderId: string): Promise<CreatePaymentOrderResponse> {
  return request(`/api/orders/${encodeURIComponent(orderId)}/create-payment-order`, { method: 'POST' });
}

export function verifyPayment(
  orderId: string,
  payload: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }
): Promise<{ success: boolean; order: OrderResponse }> {
  return request(`/api/orders/${encodeURIComponent(orderId)}/verify-payment`, {
    method: 'POST',
    body: payload,
  });
}

export function cancelOrder(orderId: string): Promise<{ success: boolean }> {
  return request(`/api/orders/${encodeURIComponent(orderId)}`, { method: 'DELETE' });
}

export function getOrders(): Promise<{ orders: OrderResponse[] }> {
  return request('/api/orders');
}

export function getOrderById(
  id: string,
  guest?: { email: string; orderNumber: string }
): Promise<{ order: OrderResponse }> {
  const search = guest ? new URLSearchParams({ email: guest.email, orderNumber: guest.orderNumber }) : null;
  return request(`/api/orders/${encodeURIComponent(id)}${search ? `?${search.toString()}` : ''}`);
}

export function formatPrice(paise: number): string {
  return `₹${(paise / 100).toFixed(2)}`;
}
