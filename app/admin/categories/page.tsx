"use client";
import { useState, useEffect } from 'react';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  type Category,
} from '@/api/admin/categories';

function slugFromName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add form
  const [addName, setAddName] = useState('');
  const [addSlug, setAddSlug] = useState('');
  const [addSortOrder, setAddSortOrder] = useState(0);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  // Edit modal
  const [editing, setEditing] = useState<Category | null>(null);
  const [editName, setEditName] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [editSortOrder, setEditSortOrder] = useState(0);
  const [updating, setUpdating] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Delete confirm
  const [deleting, setDeleting] = useState<Category | null>(null);
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const loadCategories = () => {
    setLoading(true);
    setError(null);
    getCategories()
      .then((res) => setCategories(res.categories))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load categories'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName.trim() || !addSlug.trim()) return;
    setAdding(true);
    setAddError(null);
    createCategory({ name: addName.trim(), slug: addSlug.trim().toLowerCase(), sortOrder: addSortOrder })
      .then(() => {
        setAddName('');
        setAddSlug('');
        setAddSortOrder(0);
        loadCategories();
      })
      .catch((err) => setAddError(err instanceof Error ? err.message : 'Failed to create'))
      .finally(() => setAdding(false));
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setEditName(cat.name);
    setEditSlug(cat.slug);
    setEditSortOrder(cat.sortOrder);
    setEditError(null);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setUpdating(true);
    setEditError(null);
    updateCategory(editing.id, {
      name: editName.trim(),
      slug: editSlug.trim().toLowerCase(),
      sortOrder: editSortOrder,
    })
      .then(() => {
        setEditing(null);
        loadCategories();
      })
      .catch((err) => setEditError(err instanceof Error ? err.message : 'Failed to update'))
      .finally(() => setUpdating(false));
  };

  const openDelete = (cat: Category) => {
    setDeleting(cat);
    setDeleteError(null);
  };

  const handleDeleteConfirm = () => {
    if (!deleting) return;
    setDeleteInProgress(true);
    setDeleteError(null);
    deleteCategory(deleting.id)
      .then(() => {
        setDeleting(null);
        loadCategories();
      })
      .catch((err) => setDeleteError(err instanceof Error ? err.message : 'Failed to delete'))
      .finally(() => setDeleteInProgress(false));
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Categories</h1>

      {/* Add category form */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
        <h2 className="text-sm font-semibold text-slate-800 mb-3">Add category</h2>
        <form onSubmit={handleAddSubmit} className="flex flex-wrap items-end gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-600">Name</span>
            <input
              type="text"
              value={addName}
              onChange={(e) => {
                setAddName(e.target.value);
                if (!addSlug || addSlug === slugFromName(addName)) setAddSlug(slugFromName(e.target.value));
              }}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm w-48 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              placeholder="Category name"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-600">Slug</span>
            <input
              type="text"
              value={addSlug}
              onChange={(e) => setAddSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm w-40 font-mono focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              placeholder="slug"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-600">Sort order</span>
            <input
              type="number"
              min={0}
              value={addSortOrder}
              onChange={(e) => setAddSortOrder(parseInt(e.target.value, 10) || 0)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm w-20 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
          </label>
          <button
            type="submit"
            disabled={adding || !addName.trim() || !addSlug.trim()}
            className="px-4 py-2 text-sm font-medium rounded-md bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {adding ? 'Adding…' : 'Add'}
          </button>
        </form>
        {addError && (
          <p className="mt-2 text-sm text-red-600">{addError}</p>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-slate-500 py-8">Loading…</div>
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
                  Sort order
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Products
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">{cat.name}</td>
                  <td className="px-4 py-3 text-sm text-slate-600 font-mono">{cat.slug}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{cat.sortOrder}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{cat._count.products}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => openEdit(cat)}
                      className="text-sm font-medium text-slate-600 hover:text-slate-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => openDelete(cat)}
                      className="text-sm font-medium text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {categories.length === 0 && (
            <div className="px-4 py-8 text-center text-slate-500 text-sm">No categories yet.</div>
          )}
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => !updating && setEditing(null)}>
          <div
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Edit category</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-slate-600">Name</span>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-600">Slug</span>
                <input
                  type="text"
                  value={editSlug}
                  onChange={(e) => setEditSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                  className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-mono focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-600">Sort order</span>
                <input
                  type="number"
                  min={0}
                  value={editSortOrder}
                  onChange={(e) => setEditSortOrder(parseInt(e.target.value, 10) || 0)}
                  className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                />
              </label>
              {editError && <p className="text-sm text-red-600">{editError}</p>}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  disabled={updating}
                  className="px-4 py-2 text-sm font-medium rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-4 py-2 text-sm font-medium rounded-md bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-50"
                >
                  {updating ? 'Saving…' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm modal */}
      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => !deleteInProgress && setDeleting(null)}>
          <div
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-slate-800 mb-2">Delete category?</h2>
            <p className="text-sm text-slate-600 mb-4">
              “{deleting.name}” will be permanently removed. This only works if it has no products.
            </p>
            {deleteError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
                {deleteError}
              </div>
            )}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleting(null)}
                disabled={deleteInProgress}
                className="px-4 py-2 text-sm font-medium rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleteInProgress}
                className="px-4 py-2 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleteInProgress ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
