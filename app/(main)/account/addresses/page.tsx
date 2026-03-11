"use client";
import { useState, useEffect, useCallback } from 'react';
import { AddressCard } from '@/components/account/AddressCard';
import type { SavedAddress } from '@/types/account';
import { listAddresses, createAddress, updateAddress, deleteAddress, toSavedAddress } from '@/api/addresses';

const SHADOWS: ('secondary' | 'text-chocolate' | 'accent-strawberry')[] = [
  'secondary',
  'text-chocolate',
  'accent-strawberry',
];
const ROTATIONS: ('none' | 'right' | 'left')[] = ['none', 'right', 'left'];

const emptyForm = {
  label: '',
  name: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  pincode: '',
  isDefault: false,
};

export default function SavedAddressesPage() {
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchAddresses = useCallback(() => {
    listAddresses()
      .then(({ addresses: list }) => setAddresses(list.map(toSavedAddress)))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load addresses.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleEdit = (id: string) => {
    const a = addresses.find((x) => x.id === id);
    if (!a) return;
    setForm({
      label: a.label,
      name: a.recipientName,
      phone: a.phone,
      line1: a.line1,
      line2: a.line2 ?? '',
      city: a.city,
      state: a.state,
      pincode: a.zip,
      isDefault: a.isDefault,
    });
    setEditingId(id);
    setModalOpen(true);
  };

  const handleAddNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const a = addresses.find((x) => x.id === id);
    if (a?.isDefault) return;
    try {
      await deleteAddress(id);
      setAddresses((prev) => prev.filter((x) => x.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete.');
    }
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      if (editingId) {
        const { address } = await updateAddress(editingId, {
          label: form.label,
          name: form.name,
          phone: form.phone,
          line1: form.line1,
          line2: form.line2 || null,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          isDefault: form.isDefault,
        });
        setAddresses((prev) => prev.map((a) => (a.id === editingId ? toSavedAddress(address) : a)));
      } else {
        const { address } = await createAddress({
          label: form.label,
          name: form.name,
          phone: form.phone,
          line1: form.line1,
          line2: form.line2 || undefined,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          isDefault: form.isDefault,
        });
        setAddresses((prev) => [...prev, toSavedAddress(address)]);
      }
      setModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save address.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <span
        className="absolute top-40 right-10 z-0 hidden lg:block animate-bounce duration-[3000ms] material-symbols-outlined text-6xl text-accent-mango/20 rotate-12"
        aria-hidden
      >
        home_pin
      </span>
      <span
        className="absolute bottom-20 left-10 z-0 hidden lg:block animate-pulse duration-[4000ms] material-symbols-outlined text-8xl text-primary/10 -rotate-12"
        aria-hidden
      >
        local_shipping
      </span>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 relative z-10">
        <div className="relative">
          <span className="hand-font text-primary text-xl rotate-[-4deg] absolute -top-8 left-0">
            Don&apos;t ghost the delivery guy!
          </span>
          <h1 className="text-5xl md:text-6xl text-text-chocolate brand-font uppercase leading-[0.9] tracking-tight">
            Saved
            <br />
            <span className="relative inline-block">
              Addresses
              <svg
                className="absolute w-[110%] h-4 -bottom-1 -left-1 text-accent-mango fill-current z-[-1] -rotate-1"
                viewBox="0 0 200 9"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M2.00025 6.99997C2.00025 6.99997 32.653 1.00018 97.466 1.00018C162.279 1.00018 198.001 7.49997 198.001 7.49997"
                  stroke="#FF9F1C"
                  strokeLinecap="round"
                  strokeWidth="6"
                />
              </svg>
            </span>
          </h1>
        </div>
        <button
          type="button"
          onClick={handleAddNew}
          className="px-6 py-4 bg-primary text-white text-lg border-4 border-text-chocolate shadow-[6px_6px_0px_0px_#2D1B0E] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#2D1B0E] hover:rotate-1 transition-all transform btn-text flex items-center gap-2 group w-full md:w-auto justify-center"
        >
          <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">
            add
          </span>
          ADD NEW ADDRESS
        </button>
      </div>

      {error && (
        <p className="text-accent-strawberry font-bold mb-4 relative z-10" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <div className="flex justify-center py-12 relative z-10">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
        </div>
      ) : addresses.length === 0 ? (
        <div className="relative z-10">
          <div className="relative bg-white border-4 border-text-chocolate shadow-[8px_8px_0px_0px_#E0F7FA] p-8 md:p-12 text-center max-w-xl mx-auto">
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 tape-strip rotate-2"
              aria-hidden
            />
            <span
              className="material-symbols-outlined text-6xl text-accent-mango/80 mb-4 block"
              aria-hidden
            >
              location_off
            </span>
            <h2 className="text-2xl md:text-3xl text-text-chocolate brand-font uppercase tracking-tight mb-2">
              No addresses yet
            </h2>
            <p className="text-text-chocolate/80 font-bold product-font mb-6">
              Add your first address so we know where to send the good stuff.
            </p>
            <button
              type="button"
              onClick={handleAddNew}
              className="px-6 py-4 bg-primary text-white text-lg font-bold border-4 border-text-chocolate shadow-[6px_6px_0px_0px_#2D1B0E] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#2D1B0E] transition-all uppercase tracking-wider inline-flex items-center gap-2"
            >
              <span className="material-symbols-outlined">add</span>
              Add your first address
            </button>
          </div>
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {addresses.map((address, i) => (
          <AddressCard
            key={address.id}
            address={address}
            shadowColor={SHADOWS[i % SHADOWS.length]}
            rotation={ROTATIONS[i % ROTATIONS.length]}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" aria-modal="true">
          <div className="bg-white border-4 border-text-chocolate shadow-lg max-w-lg w-full max-h-[90vh] flex flex-col p-6">
            <h2 className="text-2xl font-bold product-font uppercase mb-4 shrink-0">
              {editingId ? 'Edit address' : 'Add new address'}
            </h2>
            <form onSubmit={handleModalSubmit} className="flex flex-col flex-1 min-h-0 flex overflow-hidden">
              <div className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-1">
                <div>
                  <label className="block text-xs font-bold uppercase text-text-chocolate/70 mb-1">Label (e.g. Home)</label>
                  <input
                    required
                    value={form.label}
                    onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))}
                    className="input-snacqo"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-text-chocolate/70 mb-1">Recipient name</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    className="input-snacqo"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-text-chocolate/70 mb-1">Phone</label>
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                    className="input-snacqo"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-text-chocolate/70 mb-1">Address line 1</label>
                  <input
                    required
                    value={form.line1}
                    onChange={(e) => setForm((p) => ({ ...p, line1: e.target.value }))}
                    className="input-snacqo"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-text-chocolate/70 mb-1">Address line 2 (optional)</label>
                  <input
                    value={form.line2}
                    onChange={(e) => setForm((p) => ({ ...p, line2: e.target.value }))}
                    className="input-snacqo"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-text-chocolate/70 mb-1">City</label>
                    <input
                      required
                      value={form.city}
                      onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                      className="input-snacqo"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-text-chocolate/70 mb-1">State</label>
                    <input
                      required
                      value={form.state}
                      onChange={(e) => setForm((p) => ({ ...p, state: e.target.value }))}
                      className="input-snacqo"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-text-chocolate/70 mb-1">Pincode</label>
                  <input
                    required
                    value={form.pincode}
                    onChange={(e) => setForm((p) => ({ ...p, pincode: e.target.value }))}
                    className="input-snacqo"
                  />
                </div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.isDefault}
                    onChange={(e) => setForm((p) => ({ ...p, isDefault: e.target.checked }))}
                    className="w-5 h-5 accent-primary"
                  />
                  <span className="text-sm font-bold">Set as default address</span>
                </label>
              </div>
              <div className="flex gap-3 pt-4 mt-4 shrink-0 border-t-2 border-text-chocolate/20">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2 border-2 border-text-chocolate font-bold uppercase text-sm hover:bg-text-chocolate hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2 bg-primary text-white font-bold border-2 border-text-chocolate shadow-[4px_4px_0px_0px_#2D1B0E] uppercase text-sm disabled:opacity-70"
                >
                  {saving ? 'Saving…' : editingId ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
