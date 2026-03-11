"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getProducts, deleteProduct, type Product } from '@/api/admin/products';
import { getCategories } from '@/api/admin/categories';
import type { Category } from '@/api/admin/categories';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<boolean | ''>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadCategories = () => {
    getCategories().then((res) => setCategories(res.categories)).catch(() => {});
  };

  const loadProducts = () => {
    setLoading(true);
    setError(null);
    getProducts({
      category: categoryFilter || undefined,
      active: activeFilter === '' ? undefined : activeFilter,
    })
      .then((res) => setProducts(res.products))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load products'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [categoryFilter, activeFilter]);

  const handleDelete = (id: string) => {
    if (!confirm('Soft-delete this product (set inactive)?')) return;
    setDeletingId(id);
    deleteProduct(id)
      .then(() => loadProducts())
      .catch((err) => setError(err instanceof Error ? err.message : 'Delete failed'))
      .finally(() => setDeletingId(null));
  };

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Products</h1>
        <Link
          href="/admin/products/new"
          className="px-4 py-2 text-sm font-medium rounded-md bg-slate-800 text-white hover:bg-slate-700"
        >
          Add product
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-600">Category</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          >
            <option value="">All</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-600">Active</span>
          <select
            value={activeFilter === '' ? '' : activeFilter ? 'true' : 'false'}
            onChange={(e) =>
              setActiveFilter(e.target.value === '' ? '' : e.target.value === 'true')
            }
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          >
            <option value="">All</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
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
      ) : products.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 p-8 text-center text-slate-500">
          No products found.
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Active
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Variants
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">{p.name}</td>
                  <td className="px-4 py-3 text-sm text-slate-600 font-mono">{p.slug}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{p.category?.name ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 text-xs font-medium rounded ${
                        p.isActive ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {p.isActive ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{p.variants?.length ?? 0}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="text-sm font-medium text-slate-600 hover:text-slate-900 mr-3"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(p.id)}
                      disabled={deletingId === p.id}
                      className="text-sm font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
                    >
                      {deletingId === p.id ? 'Deleting…' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
