"use client";
import Link from 'next/link'
import { useState } from 'react';
import type { ShippingFormData } from '@/types/checkout';

const COUNTRY_CODES = [
  { code: '+91', flag: '🇮🇳', label: 'IN' },
  { code: '+1',  flag: '🇺🇸', label: 'US' },
  { code: '+44', flag: '🇬🇧', label: 'GB' },
  { code: '+61', flag: '🇦🇺', label: 'AU' },
  { code: '+971', flag: '🇦🇪', label: 'AE' },
  { code: '+65',  flag: '🇸🇬', label: 'SG' },
  { code: '+60',  flag: '🇲🇾', label: 'MY' },
];

function validatePhone(dialCode: string, number: string): string | null {
  const digits = number.replace(/\D/g, '');
  if (!digits) return 'Phone number is required.';
  if (dialCode === '+91') {
    if (digits.length !== 10) return 'Enter a valid 10-digit Indian mobile number.';
    if (!/^[6-9]/.test(digits)) return 'Indian mobile numbers start with 6-9.';
  } else {
    if (digits.length < 6 || digits.length > 15) return 'Enter a valid phone number.';
  }
  return null;
}

interface ShippingFormProps {
  onSubmit: (data: ShippingFormData) => void;
  initialData?: Partial<ShippingFormData>;
  isSubmitting?: boolean;
}

export function ShippingForm({ onSubmit, initialData, isSubmitting }: ShippingFormProps) {
  const [dialCode, setDialCode] = useState('+91');
  const [phoneError, setPhoneError] = useState('');

  const [form, setForm] = useState<ShippingFormData>({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    saveInfo: false,
    ...initialData,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validatePhone(dialCode, form.phone);
    if (err) {
      setPhoneError(err);
      return;
    }
    const fullPhone = `${dialCode}${form.phone.replace(/\D/g, '')}`;
    onSubmit({ ...form, phone: fullPhone });
  };

  const update = (key: keyof ShippingFormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handlePhoneChange = (value: string) => {
    const digits = value.replace(/\D/g, '');
    update('phone', digits);
    if (phoneError) setPhoneError(validatePhone(dialCode, digits) ?? '');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 border-4 border-text-chocolate shadow-[8px_8px_0px_0px_#2D1B0E] relative">
      <div
        className="absolute -top-3 right-10 w-24 h-6 tape-strip rotate-2"
        aria-hidden
      />
      <div className="flex flex-col gap-2 mb-6">
        <label className="font-extrabold text-sm uppercase tracking-wide text-text-chocolate">
          Email
        </label>
        <input
          type="email"
          placeholder="snacker@example.com"
          value={form.email}
          onChange={(e) => update('email', e.target.value)}
          className="input-brutal w-full p-3 font-bold placeholder:text-gray-400 bg-background-light"
          required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="flex flex-col gap-2">
          <label className="font-extrabold text-sm uppercase tracking-wide text-text-chocolate">
            First Name
          </label>
          <input
            type="text"
            placeholder="Snack"
            value={form.firstName}
            onChange={(e) => update('firstName', e.target.value)}
            className="input-brutal w-full p-3 font-bold placeholder:text-gray-400 bg-background-light"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-extrabold text-sm uppercase tracking-wide text-text-chocolate">
            Last Name
          </label>
          <input
            type="text"
            placeholder="Lover"
            value={form.lastName}
            onChange={(e) => update('lastName', e.target.value)}
            className="input-brutal w-full p-3 font-bold placeholder:text-gray-400 bg-background-light"
            required
          />
        </div>
      </div>
      <div className="flex flex-col gap-2 mb-6">
        <label className="font-extrabold text-sm uppercase tracking-wide text-text-chocolate">
          Address
        </label>
        <input
          type="text"
          placeholder="123 Flavor St, Apt 4"
          value={form.address}
          onChange={(e) => update('address', e.target.value)}
          className="input-brutal w-full p-3 font-bold placeholder:text-gray-400 bg-background-light"
          required
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-6 mb-6">
        <div className="col-span-2 md:col-span-3 flex flex-col gap-2">
          <label className="font-extrabold text-sm uppercase tracking-wide text-text-chocolate">
            City
          </label>
          <input
            type="text"
            placeholder="Munchville"
            value={form.city}
            onChange={(e) => update('city', e.target.value)}
            className="input-brutal w-full p-3 font-bold placeholder:text-gray-400 bg-background-light"
            required
          />
        </div>
        <div className="col-span-1 md:col-span-1 flex flex-col gap-2">
          <label className="font-extrabold text-sm uppercase tracking-wide text-text-chocolate">
            State
          </label>
          <input
            type="text"
            placeholder="NY"
            value={form.state}
            onChange={(e) => update('state', e.target.value)}
            className="input-brutal w-full p-3 font-bold placeholder:text-gray-400 bg-background-light text-center"
            required
          />
        </div>
        <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
          <label className="font-extrabold text-sm uppercase tracking-wide text-text-chocolate">
            Zip Code
          </label>
          <input
            type="text"
            placeholder="10001"
            value={form.zipCode}
            onChange={(e) => update('zipCode', e.target.value)}
            className="input-brutal w-full p-3 font-bold placeholder:text-gray-400 bg-background-light"
            required
          />
        </div>
      </div>
      <div className="flex flex-col gap-2 mb-8">
        <label className="font-extrabold text-sm uppercase tracking-wide text-text-chocolate">
          Phone <span className="text-text-chocolate/50 normal-case font-bold">(for tracking updates)</span>
        </label>
        <div className="flex gap-0">
          <select
            value={dialCode}
            onChange={(e) => {
              setDialCode(e.target.value);
              if (phoneError) setPhoneError(validatePhone(e.target.value, form.phone) ?? '');
            }}
            className="input-brutal px-2 py-3 font-bold bg-secondary border-r-0 text-text-chocolate focus:outline-none cursor-pointer shrink-0 text-sm"
            aria-label="Country code"
          >
            {COUNTRY_CODES.map(({ code, flag, label }) => (
              <option key={code} value={code}>
                {flag} {code} ({label})
              </option>
            ))}
          </select>
          <input
            type="tel"
            placeholder={dialCode === '+91' ? '98765 43210' : '555 123 4567'}
            value={form.phone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            onBlur={() => setPhoneError(validatePhone(dialCode, form.phone) ?? '')}
            inputMode="numeric"
            className={`input-brutal flex-1 p-3 font-bold placeholder:text-gray-400 bg-background-light min-w-0 ${phoneError ? 'border-accent-strawberry' : ''}`}
            required
          />
        </div>
        {phoneError && (
          <p className="text-accent-strawberry text-sm font-bold" role="alert">
            {phoneError}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3 mb-6 p-4 bg-secondary border-2 border-text-chocolate">
        <input
          id="save-info"
          type="checkbox"
          checked={form.saveInfo}
          onChange={(e) => update('saveInfo', e.target.checked)}
          className="w-6 h-6 border-2 border-text-chocolate text-primary focus:ring-0 rounded-none checked:bg-primary"
        />
        <label htmlFor="save-info" className="font-bold text-sm text-text-chocolate cursor-pointer">
          Save this info for next time (make it snappy)
        </label>
      </div>
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mt-8 pt-6 border-t-2 border-dashed border-text-chocolate/30">
        <Link
          href="/cart"
          className="text-text-chocolate font-bold underline hover:text-primary flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Return to cart
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full md:w-auto bg-accent-mango px-10 py-4 text-text-chocolate text-xl border-2 border-text-chocolate shadow-[4px_4px_0px_0px_#2D1B0E] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#2D1B0E] transition-all font-black uppercase tracking-wide btn-text disabled:opacity-60"
        >
          {isSubmitting ? 'Placing order…' : 'Continue to Payment'}
        </button>
      </div>
    </form>
  );
}
