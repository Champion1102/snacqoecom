"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getProfile, updateProfile } from '@/api/users';

const initialForm = {
  firstName: '',
  lastName: '',
  birthday: '',
  email: '',
  phone: '',
  newsletter: false,
};

export default function AccountProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getProfile()
      .then(({ user }) => {
        if (cancelled) return;
        setForm({
          firstName: user.firstName ?? '',
          lastName: user.lastName ?? '',
          birthday: user.birthday ?? '',
          email: user.email,
          phone: user.phone ?? '',
          newsletter: user.newsletter,
        });
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load profile.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSuccess(false);
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setSaving(true);
    try {
      await updateProfile({
        firstName: form.firstName || undefined,
        lastName: form.lastName || undefined,
        phone: form.phone || undefined,
        birthday: form.birthday || null,
        newsletter: form.newsletter,
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/account');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <h1
          className="text-4xl md:text-5xl text-text-chocolate product-font font-black uppercase tracking-tight"
          style={{ textShadow: '2px 2px 0px #E0F7FA' }}
        >
          Edit Your Vibe
        </h1>
        <span
          className="hidden md:block material-symbols-outlined text-4xl text-accent-mango animate-spin-slow"
          style={{ animationDuration: '10s' }}
          aria-hidden
        >
          settings
        </span>
      </div>

      <div className="bg-white border-4 border-text-chocolate shadow-[8px_8px_0px_0px_#E0F7FA] relative">
        <div
          className="absolute -top-4 left-10 w-32 h-8 tape-strip z-20"
          aria-hidden
        />
        <span
          className="absolute -right-6 top-20 text-accent-mango z-10 hidden lg:block"
          aria-hidden
        >
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </span>
        <span
          className="absolute -left-6 bottom-40 text-primary z-10 hidden lg:block rotate-12"
          aria-hidden
        >
          <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 2a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 2zm0 13.75a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5a.75.75 0 01.75-.75zM3.5 10a.75.75 0 01.75-.75h3.5a.75.75 0 010 1.5h-3.5A.75.75 0 013.5 10zm12.25 0a.75.75 0 01.75-.75h3.5a.75.75 0 010 1.5h-3.5a.75.75 0 01-.75-.75z"
            />
            <circle cx="10" cy="10" r="2.5" />
          </svg>
        </span>

        <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-10">
          {error && (
            <p className="text-accent-strawberry font-bold" role="alert">
              {error}
            </p>
          )}
          {success && (
            <p className="text-green-600 font-bold" role="status">
              Profile saved successfully.
            </p>
          )}
          <section>
            <h2 className="text-2xl font-bold product-font uppercase tracking-wide mb-6 flex items-center gap-2">
              <span className="bg-accent-mango text-white w-8 h-8 flex items-center justify-center border-2 border-text-chocolate rounded-sm text-sm">
                1
              </span>
              Basic Info
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-xs font-bold uppercase text-text-chocolate/70 mb-2"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={form.firstName}
                  onChange={handleChange}
                  className="input-snacqo"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-xs font-bold uppercase text-text-chocolate/70 mb-2"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={form.lastName}
                  onChange={handleChange}
                  className="input-snacqo"
                />
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="birthday"
                  className="block text-xs font-bold uppercase text-text-chocolate/70 mb-2"
                >
                  Birthday{' '}
                  <span className="text-accent-strawberry normal-case ml-1 font-normal">
                    (we send free snacks!)
                  </span>
                </label>
                <input
                  id="birthday"
                  name="birthday"
                  type="date"
                  value={form.birthday}
                  onChange={handleChange}
                  className="input-snacqo"
                />
              </div>
            </div>
          </section>

          <section className="border-t-2 border-dashed border-text-chocolate/20 pt-8">
            <h2 className="text-2xl font-bold product-font uppercase tracking-wide mb-6 flex items-center gap-2">
              <span className="bg-secondary text-text-chocolate w-8 h-8 flex items-center justify-center border-2 border-text-chocolate rounded-sm text-sm">
                2
              </span>
              Contact Deets
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-bold uppercase text-text-chocolate/70 mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <span
                    className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-chocolate/50 text-sm pointer-events-none w-5"
                    aria-hidden
                  >
                    lock
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    disabled
                    className="input-snacqo"
                    style={{ paddingLeft: '3.25rem' }}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-xs font-bold uppercase text-text-chocolate/70 mb-2"
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  className="input-snacqo"
                />
              </div>
              <div className="md:col-span-2 flex items-center gap-2">
                <input
                  id="newsletter"
                  name="newsletter"
                  type="checkbox"
                  checked={form.newsletter}
                  onChange={handleChange}
                  className="w-5 h-5 border-2 border-text-chocolate accent-primary"
                />
                <label htmlFor="newsletter" className="text-sm font-bold text-text-chocolate">
                  Subscribe to newsletter
                </label>
              </div>
            </div>
          </section>

          <div className="flex flex-col-reverse md:flex-row items-center gap-4 pt-4 border-t-2 border-text-chocolate mt-8">
            <button
              type="button"
              onClick={handleCancel}
              className="w-full md:w-auto px-8 py-3 bg-transparent text-text-chocolate font-bold border-2 border-text-chocolate hover:bg-text-chocolate hover:text-white transition-colors uppercase tracking-wider text-sm md:text-base rounded-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="w-full md:w-auto flex-grow md:flex-grow-0 px-8 py-3 bg-primary text-white font-bold border-2 border-text-chocolate shadow-[4px_4px_0px_0px_#2D1B0E] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all uppercase tracking-wider text-lg rounded-none disabled:opacity-70"
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
