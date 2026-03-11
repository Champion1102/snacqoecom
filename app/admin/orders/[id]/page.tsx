"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  getOrderById,
  updateOrderStatus,
  formatPaise,
  type OrderDetail,
  type OrderStatus,
} from '@/api/admin/orders';

const STATUS_OPTIONS: OrderStatus[] = [
  'PENDING',
  'PROCESSING',
  'SHIPPED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
];

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return iso;
  }
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusDraft, setStatusDraft] = useState<OrderStatus | null>(null);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    getOrderById(id)
      .then((res) => {
        setOrder(res.order);
        setStatusDraft(res.order.status);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load order'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdateStatus = () => {
    if (!id || statusDraft == null || statusDraft === order?.status) return;
    setUpdating(true);
    setUpdateError(null);
    updateOrderStatus(id, statusDraft)
      .then((res) => {
        setOrder(res.order);
      })
      .catch((err) => setUpdateError(err instanceof Error ? err.message : 'Update failed'))
      .finally(() => setUpdating(false));
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="text-slate-500">Loading…</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-4 sm:p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error ?? 'Order not found'}
        </div>
        <Link href="/admin/orders" className="mt-4 inline-block text-sm text-slate-600 hover:text-slate-900">
          ← Back to orders
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/orders"
            className="text-sm text-slate-600 hover:text-slate-900 mb-1 inline-block"
          >
            ← Back to orders
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">Order {order.orderNumber}</h1>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={statusDraft ?? order.status}
            onChange={(e) => setStatusDraft(e.target.value as OrderStatus)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleUpdateStatus}
            disabled={updating || statusDraft === order.status}
            className="px-4 py-2 text-sm font-medium rounded-md bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updating ? 'Updating…' : 'Update status'}
          </button>
        </div>
      </div>

      {updateError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {updateError}
        </div>
      )}

      {/* Order info */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
          <h2 className="text-sm font-semibold text-slate-800">Order info</h2>
        </div>
        <dl className="px-4 py-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-slate-500">Email</dt>
            <dd className="font-medium text-slate-800">{order.email}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Status</dt>
            <dd>
              <span
                className={`inline-flex px-2 py-0.5 text-xs font-medium rounded ${
                  order.status === 'CANCELLED'
                    ? 'bg-red-100 text-red-800'
                    : order.status === 'DELIVERED'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-slate-100 text-slate-800'
                }`}
              >
                {order.status}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Payment</dt>
            <dd>
              {order.razorpayPaymentStatus ? (
                <span
                  className={`inline-flex px-2 py-0.5 text-xs font-medium rounded ${
                    order.razorpayPaymentStatus === 'captured'
                      ? 'bg-green-100 text-green-800'
                      : order.razorpayPaymentStatus === 'failed'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-slate-100 text-slate-800'
                  }`}
                >
                  {order.razorpayPaymentStatus}
                </span>
              ) : (
                <span className="text-slate-500">—</span>
              )}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Placed at</dt>
            <dd className="text-slate-800">{formatDate(order.createdAt)}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Subtotal</dt>
            <dd className="text-slate-800">{formatPaise(order.subtotal)}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Shipping</dt>
            <dd className="text-slate-800">{formatPaise(order.shippingAmount)}</dd>
          </div>
          {order.discountAmount > 0 && (
            <div>
              <dt className="text-slate-500">Discount</dt>
              <dd className="text-slate-800">-{formatPaise(order.discountAmount)}</dd>
            </div>
          )}
          <div>
            <dt className="text-slate-500">Total</dt>
            <dd className="font-semibold text-slate-800">{formatPaise(order.total)}</dd>
          </div>
        </dl>
      </div>

      {/* Shipping */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
          <h2 className="text-sm font-semibold text-slate-800">Shipping address</h2>
        </div>
        <div className="px-4 py-3 text-sm text-slate-700">
          <p className="font-medium text-slate-800">{order.shippingName}</p>
          <p>{order.shippingPhone}</p>
          <p>
            {order.shippingLine1}
            {order.shippingLine2 ? `, ${order.shippingLine2}` : ''}
          </p>
          <p>
            {order.shippingCity}, {order.shippingState} {order.shippingPincode}
          </p>
        </div>
      </div>

      {/* Payment (Razorpay) */}
      {(order.razorpayOrderId || order.razorpayPaymentId) && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
            <h2 className="text-sm font-semibold text-slate-800">Payment</h2>
          </div>
          <dl className="px-4 py-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {order.razorpayOrderId && (
              <div>
                <dt className="text-slate-500">Razorpay Order ID</dt>
                <dd className="font-mono text-slate-800 text-xs break-all">
                  {order.razorpayOrderId}
                </dd>
              </div>
            )}
            {order.razorpayPaymentId && (
              <div>
                <dt className="text-slate-500">Razorpay Payment ID</dt>
                <dd className="font-mono text-slate-800 text-xs break-all">
                  {order.razorpayPaymentId}
                </dd>
              </div>
            )}
          </dl>
        </div>
      )}

      {/* Items */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
          <h2 className="text-sm font-semibold text-slate-800">Items</h2>
        </div>
        <table className="min-w-full divide-y divide-slate-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">
                Product
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">
                Variant / SKU
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase">
                Qty
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase">
                Price
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {order.items.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3 text-sm font-medium text-slate-800">
                  {item.productName}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {item.variantName} <span className="text-slate-400">({item.variant.sku})</span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-800 text-right">{item.quantity}</td>
                <td className="px-4 py-3 text-sm text-slate-800 text-right">
                  {formatPaise(item.price)}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-slate-800 text-right">
                  {formatPaise(item.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
