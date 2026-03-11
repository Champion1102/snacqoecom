"use client";
import Link from 'next/link'

type CheckoutStep = 'cart' | 'shipping' | 'payment';

interface CheckoutHeaderProps {
  step: CheckoutStep;
}

const STEPS: { id: CheckoutStep; label: string }[] = [
  { id: 'cart', label: 'Cart' },
  { id: 'shipping', label: 'Shipping' },
  { id: 'payment', label: 'Payment' },
];

export function CheckoutHeader({ step }: CheckoutHeaderProps) {
  return (
    <header className="w-full z-40 px-6 py-6 border-b-2 border-text-chocolate bg-white relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo1.svg" alt="Snacqo" className="h-8 w-auto object-contain" />
        </Link>
        <nav className="hidden md:flex items-center gap-2 text-sm font-extrabold uppercase tracking-widest text-text-chocolate/50">
          {STEPS.map((s, i) => (
            <span key={s.id} className="flex items-center gap-2">
              {i > 0 && <span className="material-symbols-outlined text-base">arrow_forward</span>}
              {s.id === step ? (
                <span className="text-primary border-b-2 border-primary">{s.label}</span>
              ) : s.id === 'cart' ? (
                <Link href="/cart" className="hover:text-text-chocolate">
                  {s.label}
                </Link>
              ) : (
                <span>{s.label}</span>
              )}
            </span>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined">lock</span>
          <span className="font-bold text-sm uppercase hidden sm:inline">Secure Checkout</span>
        </div>
      </div>
    </header>
  );
}
