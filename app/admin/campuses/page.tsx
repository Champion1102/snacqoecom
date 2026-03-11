"use client";
import { useState, useEffect } from 'react';
import {
  getCampuses,
  createCampus,
  updateCampus,
  deleteCampus,
  type Campus,
} from '@/api/admin/campuses';

export default function CampusesPage() {
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [addName, setAddName] = useState('');
  const [addLine1, setAddLine1] = useState('');
  const [addLine2, setAddLine2] = useState('');
  const [addCity, setAddCity] = useState('');
  const [addState, setAddState] = useState('');
  const [addPincode, setAddPincode] = useState('');
  const [addSortOrder, setAddSortOrder] = useState(0);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const [editing, setEditing] = useState<Campus | null>(null);
  const [editName, setEditName] = useState('');
  const [editLine1, setEditLine1] = useState('');
  const [editLine2, setEditLine2] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editState, setEditState] = useState('');
  const [editPincode, setEditPincode] = useState('');
  const [editIsActive, setEditIsActive] = useState(true);
  const [editSortOrder, setEditSortOrder] = useState(0);
  const [updating, setUpdating] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const [deleting, setDeleting] = useState<Campus | null>(null);
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const loadCampuses = () => {
    setLoading(true);
    setError(null);
    getCampuses()
      .then((res) => setCampuses(res.campuses))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load campuses'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCampuses();
  }, []);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName.trim() || !addLine1.trim() || !addCity.trim() || !addState.trim() || !addPincode.trim()) return;
    setAdding(true);
    setAddError(null);
    createCampus({
      name: addName.trim(),
      line1: addLine1.trim(),
      line2: addLine2.trim() || null,
      city: addCity.trim(),
      state: addState.trim(),
      pincode: addPincode.trim(),
      sortOrder: addSortOrder,
    })
      .then(() => {
        setAddName('');
        setAddLine1('');
        setAddLine2('');
        setAddCity('');
        setAddState('');
        setAddPincode('');
        setAddSortOrder(0);
        loadCampuses();
      })
      .catch((err) => setAddError(err instanceof Error ? err.message : 'Failed to create'))
      .finally(() => setAdding(false));
  };

  const openEdit = (c: Campus) => {
    setEditing(c);
    setEditName(c.name);
    setEditLine1(c.line1);
    setEditLine2(c.line2 ?? '');
    setEditCity(c.city);
    setEditState(c.state);
    setEditPincode(c.pincode);
    setEditIsActive(c.isActive);
    setEditSortOrder(c.sortOrder);
    setEditError(null);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setUpdating(true);
    setEditError(null);
    updateCampus(editing.id, {
      name: editName.trim(),
      line1: editLine1.trim(),
      line2: editLine2.trim() || null,
      city: editCity.trim(),
      state: editState.trim(),
      pincode: editPincode.trim(),
      isActive: editIsActive,
      sortOrder: editSortOrder,
    })
      .then(() => {
        setEditing(null);
        loadCampuses();
      })
      .catch((err) => setEditError(err instanceof Error ? err.message : 'Failed to update'))
      .finally(() => setUpdating(false));
  };

  const openDelete = (c: Campus) => {
    setDeleting(c);
    setDeleteError(null);
  };

  const handleDeleteConfirm = () => {
    if (!deleting) return;
    setDeleteInProgress(true);
    setDeleteError(null);
    deleteCampus(deleting.id)
      .then(() => {
        setDeleting(null);
        loadCampuses();
      })
      .catch((err) => setDeleteError(err instanceof Error ? err.message : 'Failed to delete'))
      .finally(() => setDeleteInProgress(false));
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Campuses</h1>
      <p className="text-sm text-slate-600">
        Campuses where you deliver. Customers who select campus delivery get free shipping. Add at least one campus to enable campus delivery at checkout.
      </p>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
        <h2 className="text-sm font-semibold text-slate-800 mb-3">Add campus</h2>
        <form onSubmit={handleAddSubmit} className="space-y-3 max-w-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-600">Name</span>
              <input
                type="text"
                value={addName}
                onChange={(e) => setAddName(e.target.value)}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                placeholder="e.g. Rishihood University"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-600">Sort order</span>
              <input
                type="number"
                min={0}
                value={addSortOrder}
                onChange={(e) => setAddSortOrder(parseInt(e.target.value, 10) || 0)}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm w-24 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              />
            </label>
          </div>
          <label className="block flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-600">Address line 1</span>
            <input
              type="text"
              value={addLine1}
              onChange={(e) => setAddLine1(e.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              placeholder="Building / area"
            />
          </label>
          <label className="block flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-600">Address line 2 (optional)</span>
            <input
              type="text"
              value={addLine2}
              onChange={(e) => setAddLine2(e.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-600">City</span>
              <input
                type="text"
                value={addCity}
                onChange={(e) => setAddCity(e.target.value)}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-600">State</span>
              <input
                type="text"
                value={addState}
                onChange={(e) => setAddState(e.target.value)}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-600">Pincode</span>
              <input
                type="text"
                value={addPincode}
                onChange={(e) => setAddPincode(e.target.value)}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              />
            </label>
          </div>
          {addError && <p className="text-sm text-red-600">{addError}</p>}
          <button
            type="submit"
            disabled={adding || !addName.trim() || !addLine1.trim() || !addCity.trim() || !addState.trim() || !addPincode.trim()}
            className="px-4 py-2 text-sm font-medium rounded-md bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {adding ? 'Adding…' : 'Add campus'}
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-slate-500 py-8">Loading…</div>
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Address</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Active</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {campuses.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">{c.name}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {c.line1}
                    {c.line2 ? `, ${c.line2}` : ''}, {c.city}, {c.state} {c.pincode}
                  </td>
                  <td className="px-4 py-3 text-sm">{c.isActive ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-3 text-right">
                    <button type="button" onClick={() => openEdit(c)} className="text-sm font-medium text-slate-600 hover:text-slate-900 mr-3">
                      Edit
                    </button>
                    <button type="button" onClick={() => openDelete(c)} className="text-sm font-medium text-red-600 hover:text-red-800">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {campuses.length === 0 && (
            <div className="px-4 py-8 text-center text-slate-500 text-sm">No campuses yet. Add one to enable campus delivery.</div>
          )}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => !updating && setEditing(null)}>
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Edit campus</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-slate-600">Name</span>
                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm" required />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-600">Address line 1</span>
                <input type="text" value={editLine1} onChange={(e) => setEditLine1(e.target.value)} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm" required />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-600">Address line 2 (optional)</span>
                <input type="text" value={editLine2} onChange={(e) => setEditLine2(e.target.value)} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-medium text-slate-600">City</span>
                  <input type="text" value={editCity} onChange={(e) => setEditCity(e.target.value)} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm" required />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-600">State</span>
                  <input type="text" value={editState} onChange={(e) => setEditState(e.target.value)} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm" required />
                </label>
              </div>
              <label className="block">
                <span className="text-sm font-medium text-slate-600">Pincode</span>
                <input type="text" value={editPincode} onChange={(e) => setEditPincode(e.target.value)} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm w-32" required />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-600">Sort order</span>
                <input type="number" min={0} value={editSortOrder} onChange={(e) => setEditSortOrder(parseInt(e.target.value, 10) || 0)} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm w-24" />
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={editIsActive} onChange={(e) => setEditIsActive(e.target.checked)} className="rounded border-slate-300" />
                <span className="text-sm font-medium text-slate-600">Active (shown at checkout)</span>
              </label>
              {editError && <p className="text-sm text-red-600">{editError}</p>}
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setEditing(null)} disabled={updating} className="px-4 py-2 text-sm font-medium rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50">
                  Cancel
                </button>
                <button type="submit" disabled={updating} className="px-4 py-2 text-sm font-medium rounded-md bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-50">
                  {updating ? 'Saving…' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => !deleteInProgress && setDeleting(null)}>
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">Delete campus?</h2>
            <p className="text-sm text-slate-600 mb-4">“{deleting.name}” will be removed. Customers will no longer see it at checkout.</p>
            {deleteError && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">{deleteError}</div>}
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setDeleting(null)} disabled={deleteInProgress} className="px-4 py-2 text-sm font-medium rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50">
                Cancel
              </button>
              <button type="button" onClick={handleDeleteConfirm} disabled={deleteInProgress} className="px-4 py-2 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50">
                {deleteInProgress ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
