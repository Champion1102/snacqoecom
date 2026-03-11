"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  getOrders,
  formatPaise,
  type OrderStatus,
  type OrderListItem,
} from '@/api/admin/orders';

const STATUS_OPTIONS: { value: '' | OrderStatus; label: string }[] = [
  { value: '', label: 'All statuses' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'OUT_FOR_DELIVERY', label: 'Out for delivery' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  } catch {
    return iso;
  }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [status, setStatus] = useState<'' | OrderStatus>('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getOrders({
      status: status || undefined,
      page,
      limit: 20,
    })
      .then((res) => {
        setOrders(res.orders);
        setPagination(res.pagination);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load orders'))
      .finally(() => setLoading(false));
  }, [status, page]);

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Orders</h1>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-600">Status</span>
          <select
            value={status}
            onChange={(e) => {
              setStatus((e.target.value || '') as '' | OrderStatus);
              setPage(1);
            }}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value || 'all'} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-slate-500 py-8">Loading…</div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 p-8 text-center text-slate-500">
          No orders found.
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-medium text-slate-800">
                      {o.orderNumber}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{o.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 text-xs font-medium rounded ${
                          o.status === 'CANCELLED'
                            ? 'bg-red-100 text-red-800'
                            : o.status === 'DELIVERED'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-800 text-right">
                      {formatPaise(o.total)}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {formatDate(o.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="text-sm font-medium text-slate-600 hover:text-slate-900"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <p className="text-sm text-slate-600">
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} orders)
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={pagination.page <= 1}
                  className="px-3 py-1.5 text-sm font-medium rounded border border-slate-300 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={pagination.page >= pagination.totalPages}
                  className="px-3 py-1.5 text-sm font-medium rounded border border-slate-300 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
