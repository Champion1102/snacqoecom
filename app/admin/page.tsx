"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { getDashboard, formatPaise, type DashboardResponse } from '@/api/admin/dashboard';

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#94a3b8',
  PROCESSING: '#f59e0b',
  SHIPPED: '#0ea5e9',
  OUT_FOR_DELIVERY: '#8b5cf6',
  DELIVERED: '#22c55e',
  CANCELLED: '#ef4444',
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 flex items-center justify-center min-h-[200px]">
        <div className="text-slate-500">Loading…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { orders, revenue, lowStock, counts, productWiseOrders, ordersByDay, ordersByStatus } = data;

  const ordersByDayFormatted = ordersByDay.map((d) => ({
    ...d,
    dateShort: new Date(d.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    revenue: Math.round(d.revenuePaise / 100),
  }));

  return (
    <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Dashboard</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-3 sm:p-4 shadow-sm">
          <p className="text-xs sm:text-sm font-medium text-slate-500">Orders today</p>
          <p className="mt-1 text-lg sm:text-2xl font-bold text-slate-800">{orders.today}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-3 sm:p-4 shadow-sm">
          <p className="text-xs sm:text-sm font-medium text-slate-500">Orders this week</p>
          <p className="mt-1 text-lg sm:text-2xl font-bold text-slate-800">{orders.thisWeek}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-3 sm:p-4 shadow-sm">
          <p className="text-xs sm:text-sm font-medium text-slate-500">Revenue today</p>
          <p className="mt-1 text-lg sm:text-2xl font-bold text-slate-800">{formatPaise(revenue.todayPaise)}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-3 sm:p-4 shadow-sm">
          <p className="text-xs sm:text-sm font-medium text-slate-500">Revenue this week</p>
          <p className="mt-1 text-lg sm:text-2xl font-bold text-slate-800">{formatPaise(revenue.thisWeekPaise)}</p>
        </div>
      </div>

      {/* Delivered & Cancelled */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-3 sm:p-4 shadow-sm">
          <p className="text-xs sm:text-sm font-medium text-slate-500">Total orders</p>
          <p className="mt-1 text-base sm:text-xl font-bold text-slate-800">{orders.total}</p>
        </div>
        <div className="bg-white rounded-lg border border-green-200 p-3 sm:p-4 shadow-sm">
          <p className="text-xs sm:text-sm font-medium text-slate-500">Delivered orders</p>
          <p className="mt-1 text-base sm:text-xl font-bold text-green-700">{orders.delivered}</p>
        </div>
        <div className="bg-white rounded-lg border border-red-200 p-3 sm:p-4 shadow-sm">
          <p className="text-xs sm:text-sm font-medium text-slate-500">Cancelled orders</p>
          <p className="mt-1 text-base sm:text-xl font-bold text-red-700">{orders.cancelled}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-3 sm:p-4 shadow-sm">
          <p className="text-xs sm:text-sm font-medium text-slate-500">Active products</p>
          <p className="mt-1 text-base sm:text-xl font-bold text-slate-800">{counts.activeProducts}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-3 sm:p-4 shadow-sm">
          <p className="text-xs sm:text-sm font-medium text-slate-500">Active coupons</p>
          <p className="mt-1 text-base sm:text-xl font-bold text-slate-800">{counts.activeCoupons}</p>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Orders & Revenue last 30 days */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Orders & revenue (last 30 days)</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ordersByDayFormatted} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="dateShort" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${v}`} />
                <Tooltip
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={((value: number | undefined, name?: string) => ((name ?? '') === 'Revenue (₹)' ? `₹${value ?? 0}` : (value ?? 0))) as any}
                  labelFormatter={(_, payload) => (payload?.[0]?.payload as { dateShort?: string })?.dateShort}
                />
                <Area yAxisId="left" type="monotone" dataKey="orders" name="Orders" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.3} />
                <Area yAxisId="right" type="monotone" dataKey="revenue" name="Revenue (₹)" stroke="#22c55e" fill="#22c55e" fillOpacity={0.2} />
                <Legend />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders by status (pie) */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Orders by status</h2>
          {ordersByStatus.length === 0 ? (
            <div className="h-72 flex items-center justify-center text-slate-500 text-sm">No orders yet</div>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ordersByStatus}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {ordersByStatus.map((entry, index) => (
                      <Cell key={entry.status} fill={STATUS_COLORS[entry.status] ?? `hsl(${index * 60}, 70%, 50%)`} />
                    ))}
                  </Pie>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  <Tooltip formatter={((value: number | undefined) => [value ?? 0, 'Orders']) as any} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Product-wise orders (top 10) */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-3">Product-wise orders (delivered, top 10)</h2>
        {productWiseOrders.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-6 text-slate-500 text-sm">
            No delivered orders yet.
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productWiseOrders} layout="vertical" margin={{ top: 5, right: 20, left: 100, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="productName" width={90} tick={{ fontSize: 11 }} />
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  <Tooltip formatter={((value: number | undefined, name?: string) => [value ?? 0, (name ?? '') === 'quantitySold' ? 'Units sold' : 'Orders']) as any} />
                  <Bar dataKey="quantitySold" name="quantitySold" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="orderCount" name="orderCount" fill="#22c55e" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="px-4 py-2 border-t border-slate-100 flex gap-6 text-xs text-slate-500">
              <span><span className="inline-block w-3 h-3 rounded bg-[#0ea5e9] mr-1" /> Units sold</span>
              <span><span className="inline-block w-3 h-3 rounded bg-[#22c55e] mr-1" /> Orders</span>
            </div>
          </div>
        )}
      </div>

      {/* Low stock table */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-3">Low stock</h2>
        {lowStock.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-6 text-slate-500 text-sm">
            No variants with low stock or marked out of stock.
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Variant / SKU
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {lowStock.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-medium text-slate-800">
                      {v.product.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {v.name} <span className="text-slate-400">({v.sku})</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{v.stock}</td>
                    <td className="px-4 py-3">
                      {v.outOfStock ? (
                        <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded bg-amber-100 text-amber-800">
                          Out of stock
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded bg-orange-100 text-orange-800">
                          Low stock
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/products/${v.product.id}`}
                        className="text-sm font-medium text-slate-600 hover:text-slate-900"
                      >
                        Edit product
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
