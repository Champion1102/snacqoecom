import { request } from '@/api/client';

export type OrderStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderListItem {
  id: string;
  orderNumber: string;
  email: string;
  status: OrderStatus;
  total: number;
  currency: string;
  createdAt: string;
  _count: { items: number };
}

export interface OrderListResponse {
  orders: OrderListItem[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export interface OrderItemVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  product: { id: string; slug: string; name: string };
}

export interface OrderItemDetail {
  id: string;
  variantId: string;
  productName: string;
  variantName: string;
  quantity: number;
  price: number;
  total: number;
  variant: OrderItemVariant;
}

export interface OrderDetail {
  id: string;
  orderNumber: string;
  userId: string | null;
  email: string;
  status: OrderStatus;
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
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  razorpaySignature: string | null;
  razorpayPaymentStatus: string | null; // Razorpay status: captured | failed | authorized | created | refunded
  createdAt: string;
  updatedAt: string;
  items: OrderItemDetail[];
}

export interface OrderDetailResponse {
  order: OrderDetail;
}

export function getOrders(params?: {
  status?: OrderStatus;
  page?: number;
  limit?: number;
}): Promise<OrderListResponse> {
  const search = new URLSearchParams();
  if (params?.status) search.set('status', params.status);
  if (params?.page != null) search.set('page', String(params.page));
  if (params?.limit != null) search.set('limit', String(params.limit));
  const qs = search.toString();
  return request<OrderListResponse>(`/api/admin/orders${qs ? `?${qs}` : ''}`);
}

export function getOrderById(id: string): Promise<OrderDetailResponse> {
  return request<OrderDetailResponse>(`/api/admin/orders/${id}`);
}

export function updateOrderStatus(id: string, status: OrderStatus): Promise<OrderDetailResponse> {
  return request<OrderDetailResponse>(`/api/admin/orders/${id}`, {
    method: 'PATCH',
    body: { status },
  });
}

export function formatPaise(paise: number): string {
  return `₹${(paise / 100).toFixed(2)}`;
}
