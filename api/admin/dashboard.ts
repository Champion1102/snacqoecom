import { request } from '@/api/client';

export interface LowStockVariant {
  id: string;
  name: string;
  sku: string;
  stock: number;
  outOfStock: boolean;
  product: { id: string; name: string; slug: string };
}

export interface ProductWiseOrder {
  productId: string;
  productName: string;
  quantitySold: number;
  orderCount: number;
}

export interface OrdersByDay {
  date: string;
  orders: number;
  revenuePaise: number;
}

export interface OrdersByStatusItem {
  name: string;
  value: number;
  status: string;
}

export interface DashboardResponse {
  orders: { today: number; thisWeek: number; total: number; delivered: number; cancelled: number };
  revenue: { todayPaise: number; thisWeekPaise: number };
  lowStock: LowStockVariant[];
  counts: { activeProducts: number; activeCoupons: number };
  productWiseOrders: ProductWiseOrder[];
  ordersByDay: OrdersByDay[];
  ordersByStatus: OrdersByStatusItem[];
}

export function getDashboard(): Promise<DashboardResponse> {
  return request<DashboardResponse>('/api/admin/dashboard');
}

export function formatPaise(paise: number): string {
  return `₹${(paise / 100).toFixed(2)}`;
}
