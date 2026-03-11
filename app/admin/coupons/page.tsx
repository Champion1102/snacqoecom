"use client";
import { useState, useEffect } from 'react';
import {
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  type Coupon,
  type CouponType,
} from '@/api/admin/coupons';
import { getCampuses, type Campus } from '@/api/admin/campuses';
import { getSettings, updateSettings } from '@/api/admin/settings';

const IST = 'Asia/Kolkata';

/** Format stored ISO date as date + time in IST for display (e.g. "15 Mar 2025, 2:30 pm IST") */
function formatDateTimeIST(iso: string): string {
  try {
    return new Date(iso).toLocaleString('en-IN', {
      timeZone: IST,
      dateStyle: 'medium',
      timeStyle: 'short',
      hour12: true,
    }) + ' IST';
  } catch {
    return iso;
  }
}

/** Convert stored ISO to "YYYY-MM-DDTHH:mm" for datetime-local input (IST) */
function toDateTimeLocalIST(iso: string): string {
  try {
    const d = new Date(iso);
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: IST,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(d);
    const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
    const year = get('year');
    const month = get('month');
    const day = get('day');
    const hour = get('hour');
    const minute = get('minute');
    return `${year}-${month}-${day}T${hour}:${minute}`;
  } catch {
    return '';
  }
}

/** Parse "YYYY-MM-DDTHH:mm" from datetime-local as IST and return ISO string for API */
function dateTimeLocalISTToISO(value: string): string {
  if (!value || !value.includes('T')) return '';
  return new Date(value + ':00+05:30').toISOString();
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [allowMultipleCoupons, setAllowMultipleCoupons] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [settingsSaving, setSettingsSaving] = useState(false);

  // Create form
  const [createOpen, setCreateOpen] = useState(false);
  const [code, setCode] = useState('');
  const [type, setType] = useState<CouponType>('PERCENT');
  const [value, setValue] = useState('');
  const [minOrderAmount, setMinOrderAmount] = useState('');
  const [maxUses, setMaxUses] = useState('');
  const [validFrom, setValidFrom] = useState('');
  const [validTo, setValidTo] = useState('');
  const [campusOnly, setCampusOnly] = useState(false);
  const [allowedCampusIds, setAllowedCampusIds] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [campuses, setCampuses] = useState<Campus[]>([]);

  // Edit modal
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [editCode, setEditCode] = useState('');
  const [editType, setEditType] = useState<CouponType>('PERCENT');
  const [editValue, setEditValue] = useState('');
  const [editMinOrderAmount, setEditMinOrderAmount] = useState('');
  const [editMaxUses, setEditMaxUses] = useState('');
  const [editValidFrom, setEditValidFrom] = useState('');
  const [editValidTo, setEditValidTo] = useState('');
  const [editIsActive, setEditIsActive] = useState(true);
  const [editCampusOnly, setEditCampusOnly] = useState(false);
  const [editAllowedCampusIds, setEditAllowedCampusIds] = useState<string[]>([]);
  const [updating, setUpdating] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Delete / deactivate
  const [deactivateId, setDeactivateId] = useState<string | null>(null);
  const [hardDeleteCoupon, setHardDeleteCoupon] = useState<Coupon | null>(null);
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const loadCoupons = () => {
    setLoading(true);
    setError(null);
    getCoupons()
      .then((res) => setCoupons(res.coupons))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load coupons'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  useEffect(() => {
    getCampuses()
      .then((res) => setCampuses(res.campuses))
      .catch(() => setCampuses([]));
  }, []);

  useEffect(() => {
    setSettingsLoading(true);
    getSettings()
      .then((res) => setAllowMultipleCoupons(res.allowMultipleCoupons))
      .catch(() => setAllowMultipleCoupons(false))
      .finally(() => setSettingsLoading(false));
  }, []);

  const handleAllowMultipleCouponsChange = (checked: boolean) => {
    setSettingsSaving(true);
    updateSettings({ allowMultipleCoupons: checked })
      .then((res) => setAllowMultipleCoupons(res.allowMultipleCoupons))
      .catch(() => {})
      .finally(() => setSettingsSaving(false));
  };

  const resetCreateForm = () => {
    setCode('');
    setType('PERCENT');
    setValue('');
    setMinOrderAmount('');
    setMaxUses('');
    setValidFrom('');
    setValidTo('');
    setCampusOnly(false);
    setAllowedCampusIds([]);
    setCreateError(null);
    setCreateOpen(false);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setCreateError('Code is required.');
      return;
    }
    if (type === 'FREE_SHIPPING') {
      // value not used
    } else {
      const valueNum = type === 'PERCENT' ? parseInt(value, 10) : parseFloat(value);
      const valuePaise = type === 'PERCENT'
        ? (Number.isNaN(valueNum) ? 0 : Math.min(100, Math.max(0, valueNum)))
        : Math.round((Number.isFinite(valueNum) ? valueNum : 0) * 100);
      if (type === 'PERCENT' ? (Number.isNaN(valueNum) || valueNum < 0 || valueNum > 100) : valuePaise < 0) {
        setCreateError(type === 'PERCENT' ? 'Percent (0–100) is required.' : 'Value (₹) is required.');
        return;
      }
    }
    if (!validFrom || !validTo) {
      setCreateError('Valid from and valid to (date & time in IST) are required.');
      return;
    }
    setCreating(true);
    setCreateError(null);
    const valueNum = type === 'PERCENT' ? parseInt(value, 10) : parseFloat(value);
    const valuePaise = type === 'PERCENT'
      ? (Number.isNaN(valueNum) ? 0 : Math.min(100, Math.max(0, valueNum)))
      : Math.round((Number.isFinite(valueNum) ? valueNum : 0) * 100);
    const minOrderPaise = minOrderAmount === '' ? null : Math.max(0, Math.round(parseFloat(minOrderAmount) * 100));
    createCoupon({
      code: code.trim().toUpperCase(),
      type,
      value: type === 'FREE_SHIPPING' ? 0 : (type === 'PERCENT' ? valueNum : valuePaise),
      minOrderAmount: minOrderPaise,
      maxUses: maxUses === '' ? null : Math.max(0, parseInt(maxUses, 10) || 0),
      validFrom: dateTimeLocalISTToISO(validFrom),
      validTo: dateTimeLocalISTToISO(validTo),
      campusOnly,
      allowedCampusIds: campusOnly ? allowedCampusIds : [],
    })
      .then(() => {
        resetCreateForm();
        loadCoupons();
      })
      .catch((err) => setCreateError(err instanceof Error ? err.message : 'Create failed'))
      .finally(() => setCreating(false));
  };

  const openEdit = (c: Coupon) => {
    setEditing(c);
    setEditCode(c.code);
    setEditType(c.type);
    setEditValue(c.type === 'FREE_SHIPPING' ? '' : c.type === 'PERCENT' ? String(c.value) : (c.value / 100).toFixed(2));
    setEditMinOrderAmount(c.minOrderAmount != null ? (c.minOrderAmount / 100).toFixed(2) : '');
    setEditMaxUses(c.maxUses != null ? String(c.maxUses) : '');
    setEditValidFrom(toDateTimeLocalIST(c.validFrom));
    setEditValidTo(toDateTimeLocalIST(c.validTo));
    setEditIsActive(c.isActive);
    setEditCampusOnly(c.campusOnly ?? false);
    setEditAllowedCampusIds(c.allowedCampusIds ?? []);
    setEditError(null);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    if (!editCode.trim()) {
      setEditError('Code is required.');
      return;
    }
    if (editType !== 'FREE_SHIPPING') {
      const valueNum = editType === 'PERCENT' ? parseInt(editValue, 10) : parseFloat(editValue);
      const valuePaise = editType === 'PERCENT'
        ? (Number.isNaN(valueNum) ? 0 : Math.min(100, Math.max(0, valueNum)))
        : Math.round((Number.isFinite(valueNum) ? valueNum : 0) * 100);
      if (editType === 'PERCENT' ? (Number.isNaN(valueNum) || valueNum < 0 || valueNum > 100) : valuePaise < 0) {
        setEditError(editType === 'PERCENT' ? 'Percent (0–100) required.' : 'Value (₹) required.');
        return;
      }
    }
    setUpdating(true);
    setEditError(null);
    const minOrderPaise = editMinOrderAmount === '' ? null : Math.max(0, Math.round(parseFloat(editMinOrderAmount) * 100));
    const valueNum = editType === 'PERCENT' ? parseInt(editValue, 10) : parseFloat(editValue);
    const valuePaise = editType === 'PERCENT'
      ? (Number.isNaN(valueNum) ? 0 : Math.min(100, Math.max(0, valueNum)))
      : Math.round((Number.isFinite(valueNum) ? valueNum : 0) * 100);
    updateCoupon(editing.id, {
      code: editCode.trim().toUpperCase(),
      type: editType,
      value: editType === 'FREE_SHIPPING' ? 0 : (editType === 'PERCENT' ? valueNum : valuePaise),
      minOrderAmount: minOrderPaise,
      maxUses: editMaxUses === '' ? null : Math.max(0, parseInt(editMaxUses, 10) || 0),
      validFrom: editValidFrom ? dateTimeLocalISTToISO(editValidFrom) : undefined,
      validTo: editValidTo ? dateTimeLocalISTToISO(editValidTo) : undefined,
      isActive: editIsActive,
      campusOnly: editCampusOnly,
      allowedCampusIds: editCampusOnly ? editAllowedCampusIds : [],
    })
      .then(() => {
        setEditing(null);
        loadCoupons();
      })
      .catch((err) => setEditError(err instanceof Error ? err.message : 'Update failed'))
      .finally(() => setUpdating(false));
  };

  const handleDeactivate = (id: string) => {
    setDeactivateId(id);
    setDeleteError(null);
    deleteCoupon(id, false)
      .then(() => loadCoupons())
      .catch((err) => setDeleteError(err instanceof Error ? err.message : 'Deactivate failed'))
      .finally(() => setDeactivateId(null));
  };

  const openHardDelete = (c: Coupon) => setHardDeleteCoupon(c);
  const handleHardDelete = () => {
    if (!hardDeleteCoupon) return;
    setDeleteInProgress(true);
    setDeleteError(null);
    deleteCoupon(hardDeleteCoupon.id, true)
      .then(() => {
        setHardDeleteCoupon(null);
        loadCoupons();
      })
      .catch((err) => setDeleteError(err instanceof Error ? err.message : 'Delete failed'))
      .finally(() => setDeleteInProgress(false));
  };

  const formatValue = (c: Coupon) =>
    c.type === 'FREE_SHIPPING' ? 'Free shipping' : c.type === 'PERCENT' ? `${c.value}%` : `₹${(c.value / 100).toFixed(2)}`;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Coupons</h1>
        <button
          type="button"
          onClick={() => { resetCreateForm(); setCreateOpen(true); }}
          className="px-4 py-2 text-sm font-medium rounded-md bg-slate-800 text-white hover:bg-slate-700"
        >
          Create coupon
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
        <h2 className="text-sm font-semibold text-slate-700 mb-3">Coupon settings</h2>
        {settingsLoading ? (
          <span className="text-slate-500 text-sm">Loading…</span>
        ) : (
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={allowMultipleCoupons}
              onChange={(e) => handleAllowMultipleCouponsChange(e.target.checked)}
              disabled={settingsSaving}
              className="w-4 h-4 rounded border-slate-300 text-slate-800 focus:ring-slate-500"
            />
            <span className="text-sm text-slate-700">Allow customers to use multiple coupon codes per order</span>
            {settingsSaving && <span className="text-slate-400 text-xs">Saving…</span>}
          </label>
        )}
      </div>

      {loading ? (
        <div className="text-slate-500 py-8">Loading…</div>
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Code</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Value</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Valid from (IST)</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Valid to (IST)</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Used</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Max uses</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Active</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm font-medium text-slate-800 font-mono">{c.code}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{c.type}</td>
                  <td className="px-4 py-3 text-sm text-slate-800 text-right">{formatValue(c)}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{formatDateTimeIST(c.validFrom)}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{formatDateTimeIST(c.validTo)}</td>
                  <td className="px-4 py-3 text-sm text-slate-800 text-right">{c.usedCount}</td>
                  <td className="px-4 py-3 text-sm text-slate-600 text-right">{c.maxUses ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded ${c.isActive ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'}`}>
                      {c.isActive ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button type="button" onClick={() => openEdit(c)} className="text-sm font-medium text-slate-600 hover:text-slate-900 mr-2">Edit</button>
                    {c.isActive && (
                      <button
                        type="button"
                        onClick={() => handleDeactivate(c.id)}
                        disabled={deactivateId === c.id}
                        className="text-sm font-medium text-amber-600 hover:text-amber-800 mr-2 disabled:opacity-50"
                      >
                        {deactivateId === c.id ? '…' : 'Deactivate'}
                      </button>
                    )}
                    <button type="button" onClick={() => openHardDelete(c)} className="text-sm font-medium text-red-600 hover:text-red-800">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {coupons.length === 0 && (
            <div className="px-4 py-8 text-center text-slate-500 text-sm">No coupons yet.</div>
          )}
        </div>
      )}

      {/* Create modal */}
      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => !creating && resetCreateForm()}>
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Create coupon</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              {createError && <p className="text-sm text-red-600">{createError}</p>}
              <label className="block">
                <span className="text-sm font-medium text-slate-600">Code *</span>
                <input type="text" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} required className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-mono" placeholder="SAVE10" />
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-medium text-slate-600">Type</span>
                  <select value={type} onChange={(e) => setType(e.target.value as CouponType)} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
                    <option value="PERCENT">Percent</option>
                    <option value="FIXED">Fixed (₹)</option>
                    <option value="FREE_SHIPPING">Free shipping</option>
                  </select>
                </label>
                {type !== 'FREE_SHIPPING' && (
                  <label className="block">
                    <span className="text-sm font-medium text-slate-600">Value *</span>
                    <input type="number" min={0} max={type === 'PERCENT' ? 100 : undefined} step={type === 'PERCENT' ? 1 : 0.01} value={value} onChange={(e) => setValue(e.target.value)} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder={type === 'PERCENT' ? '10' : '50.00'} />
                  </label>
                )}
              </div>
              <label className="block">
                <span className="text-sm font-medium text-slate-600">Min order (₹, optional)</span>
                <input type="number" min={0} step="0.01" value={minOrderAmount} onChange={(e) => setMinOrderAmount(e.target.value)} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="—" />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-600">Max uses (optional)</span>
                <input type="number" min={0} value={maxUses} onChange={(e) => setMaxUses(e.target.value)} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="—" />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-600">Valid from * (IST)</span>
                <input type="datetime-local" value={validFrom} onChange={(e) => setValidFrom(e.target.value)} required className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-600">Valid to * (IST)</span>
                <input type="datetime-local" value={validTo} onChange={(e) => setValidTo(e.target.value)} required className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={campusOnly} onChange={(e) => setCampusOnly(e.target.checked)} className="rounded border-slate-300" />
                <span className="text-sm font-medium text-slate-600">Campus only (valid only for campus delivery orders)</span>
              </label>
              {campusOnly && campuses.length > 0 && (
                <label className="block">
                  <span className="text-sm font-medium text-slate-600">Allowed campuses (leave empty = any campus)</span>
                  <select
                    multiple
                    value={allowedCampusIds}
                    onChange={(e) => setAllowedCampusIds(Array.from(e.target.selectedOptions, (o) => o.value))}
                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm min-h-[80px]"
                  >
                    {campuses.map((cam) => (
                      <option key={cam.id} value={cam.id}>{cam.name}</option>
                    ))}
                  </select>
                </label>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={resetCreateForm} disabled={creating} className="px-4 py-2 text-sm font-medium rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={creating} className="px-4 py-2 text-sm font-medium rounded-md bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-50">{creating ? 'Creating…' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => !updating && setEditing(null)}>
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Edit coupon</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              {editError && <p className="text-sm text-red-600">{editError}</p>}
              <label className="block">
                <span className="text-sm font-medium text-slate-600">Code *</span>
                <input type="text" value={editCode} onChange={(e) => setEditCode(e.target.value.toUpperCase())} required className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-mono" />
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-medium text-slate-600">Type</span>
                  <select value={editType} onChange={(e) => setEditType(e.target.value as CouponType)} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
                    <option value="PERCENT">Percent</option>
                    <option value="FIXED">Fixed (₹)</option>
                    <option value="FREE_SHIPPING">Free shipping</option>
                  </select>
                </label>
                {editType !== 'FREE_SHIPPING' && (
                  <label className="block">
                    <span className="text-sm font-medium text-slate-600">Value *</span>
                    <input type="number" min={0} max={editType === 'PERCENT' ? 100 : undefined} step={editType === 'PERCENT' ? 1 : 0.01} value={editValue} onChange={(e) => setEditValue(e.target.value)} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder={editType === 'PERCENT' ? '10' : '50.00'} />
                  </label>
                )}
              </div>
              <label className="block">
                <span className="text-sm font-medium text-slate-600">Min order (₹)</span>
                <input type="number" min={0} step="0.01" value={editMinOrderAmount} onChange={(e) => setEditMinOrderAmount(e.target.value)} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="—" />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-600">Max uses</span>
                <input type="number" min={0} value={editMaxUses} onChange={(e) => setEditMaxUses(e.target.value)} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-600">Valid from (IST)</span>
                <input type="datetime-local" value={editValidFrom} onChange={(e) => setEditValidFrom(e.target.value)} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-600">Valid to (IST)</span>
                <input type="datetime-local" value={editValidTo} onChange={(e) => setEditValidTo(e.target.value)} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={editIsActive} onChange={(e) => setEditIsActive(e.target.checked)} className="rounded border-slate-300" />
                <span className="text-sm text-slate-600">Active</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={editCampusOnly} onChange={(e) => setEditCampusOnly(e.target.checked)} className="rounded border-slate-300" />
                <span className="text-sm text-slate-600">Campus only (valid only for campus delivery orders)</span>
              </label>
              {editCampusOnly && campuses.length > 0 && (
                <label className="block">
                  <span className="text-sm font-medium text-slate-600">Allowed campuses (empty = any campus)</span>
                  <select
                    multiple
                    value={editAllowedCampusIds}
                    onChange={(e) => setEditAllowedCampusIds(Array.from(e.target.selectedOptions, (o) => o.value))}
                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm min-h-[80px]"
                  >
                    {campuses.map((cam) => (
                      <option key={cam.id} value={cam.id}>{cam.name}</option>
                    ))}
                  </select>
                </label>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setEditing(null)} disabled={updating} className="px-4 py-2 text-sm font-medium rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={updating} className="px-4 py-2 text-sm font-medium rounded-md bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-50">{updating ? 'Saving…' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hard delete confirm */}
      {hardDeleteCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => !deleteInProgress && setHardDeleteCoupon(null)}>
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">Permanently delete?</h2>
            <p className="text-sm text-slate-600 mb-4">Coupon &quot;{hardDeleteCoupon.code}&quot; will be removed. This cannot be undone.</p>
            {deleteError && <p className="text-sm text-red-600 mb-4">{deleteError}</p>}
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setHardDeleteCoupon(null)} disabled={deleteInProgress} className="px-4 py-2 text-sm font-medium rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50">Cancel</button>
              <button type="button" onClick={handleHardDelete} disabled={deleteInProgress} className="px-4 py-2 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50">{deleteInProgress ? 'Deleting…' : 'Delete permanently'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
