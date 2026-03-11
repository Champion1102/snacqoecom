"use client";
import { useState, useEffect } from 'react';
import type { CheckoutOrderItem } from '@/types/checkout';

export interface AppliedCouponItem {
  code: string;
  discountAmount: number;
  freeShipping: boolean;
  message: string;
}

interface CheckoutOrderSummaryProps {
  items: CheckoutOrderItem[];
  subtotal: string;
  total: string;
  shippingAmount?: string;
  appliedCoupons: AppliedCouponItem[];
  discountAmount?: string;
  couponMessage?: string;
  onApplyCoupon?: (code: string) => Promise<void>;
  onRemoveCoupon?: (code: string) => void;
}

export function CheckoutOrderSummary({
  items,
  subtotal,
  total,
  shippingAmount,
  appliedCoupons,
  discountAmount,
  couponMessage,
  onApplyCoupon,
  onRemoveCoupon,
}: CheckoutOrderSummaryProps) {
  const [couponInput, setCouponInput] = useState('');
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    if (appliedCoupons.length > 0) setCouponInput(''); // Clear input when a code is applied so user can type another
  }, [appliedCoupons.length]);

  const handleApply = async () => {
    const code = couponInput.trim();
    if (!code || !onApplyCoupon) return;
    setApplying(true);
    try {
      await onApplyCoupon(code);
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="sticky top-8">
      <div className="bg-background-light p-6 md:p-8 border-4 border-text-chocolate shadow-[8px_8px_0px_0px_#E0F7FA] rotate-1 relative">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white px-4 py-1 border-2 border-text-chocolate shadow-[2px_2px_0px_0px_#2D1B0E] -rotate-2 z-10">
          <span className="brand-font text-xl text-primary">Your Haul</span>
        </div>
        <div className="flex flex-col gap-6 mt-4 max-h-[400px] overflow-y-auto no-scrollbar pr-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-4 pb-4 border-b-2 border-dashed border-text-chocolate/20"
            >
              <div className="w-20 h-20 bg-secondary border-2 border-text-chocolate relative flex-shrink-0 overflow-hidden">
                {item.imageUrl ? (
                  <img
                    alt={item.name}
                    src={item.imageUrl}
                    className="w-full h-full object-cover opacity-90 mix-blend-multiply"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-white">
                    <span className="material-symbols-outlined text-4xl text-primary">shopping_bag</span>
                  </div>
                )}
                <span className="absolute -top-2 -right-2 bg-accent-strawberry text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border border-text-chocolate">
                  {item.quantity}
                </span>
              </div>
              <div className="flex-grow min-w-0">
                <h4 className="font-extrabold text-lg leading-tight">{item.name}</h4>
                <p className="text-sm text-text-chocolate/70 font-bold">{item.variant}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-black text-lg">
                  {item.price}
                  <span className="text-text-chocolate/80 font-bold text-base ml-1">× {item.quantity}</span>
                </div>
                {item.pricePaise != null && item.quantity > 0 && (
                  <div className="text-sm font-bold text-primary mt-0.5">
                    = ₹{((item.pricePaise * item.quantity) / 100).toFixed(2)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {onApplyCoupon && (
          <div className="flex flex-col gap-2 mt-6 mb-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Discount Code?"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                className="input-brutal w-full p-2 font-bold placeholder:text-gray-400 bg-white text-sm"
              />
              <button
                type="button"
                onClick={handleApply}
                disabled={applying || !couponInput.trim()}
                className="bg-text-chocolate text-white px-4 border-2 border-text-chocolate shadow-[2px_2px_0px_0px_#999] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all font-bold uppercase text-sm btn-text disabled:opacity-50 shrink-0"
              >
                {applying ? '…' : 'Apply'}
              </button>
            </div>
            {appliedCoupons.length > 0 && onRemoveCoupon && (
              <div className="flex flex-col gap-1">
                {appliedCoupons.map((c) => (
                  <p key={c.code} className="text-sm font-bold text-text-chocolate flex items-center gap-2 flex-wrap">
                    <span className="text-green-600">Code applied: {c.code}</span>
                    <button
                      type="button"
                      onClick={() => onRemoveCoupon(c.code)}
                      className="underline hover:text-primary font-bold"
                    >
                      Remove
                    </button>
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
        {couponMessage && (
          <p className={`text-sm font-bold mb-4 ${appliedCoupons.length > 0 || discountAmount ? 'text-green-600' : 'text-accent-strawberry'}`}>
            {couponMessage}
          </p>
        )}
        <div className="space-y-3 pt-2">
          <div className="flex justify-between text-text-chocolate font-bold">
            <span>Subtotal</span>
            <span>{subtotal}</span>
          </div>
          {discountAmount && (
            <div className="flex justify-between text-text-chocolate font-bold text-green-600">
            <span>Discount</span>
            <span>-{discountAmount}</span>
          </div>
          )}
          <div className="flex justify-between text-text-chocolate font-bold">
            <span>Shipping</span>
            <span>{shippingAmount ?? '—'}</span>
          </div>
          <p className="flex items-center gap-2 text-sm font-bold text-primary mt-1">
            <span className="material-symbols-outlined text-base">local_shipping</span>
            {shippingAmount === 'Free' ? "You've got free delivery!" : 'Free delivery on orders above ₹499'}
          </p>
        </div>
        <div className="flex justify-between items-center mt-6 pt-6 border-t-2 border-text-chocolate">
          <span className="brand-font text-2xl">Total</span>
          <div className="flex items-end gap-2">
            <span className="brand-font text-4xl text-primary">{total}</span>
          </div>
        </div>
      </div>
      <div className="mt-8 flex flex-col items-center justify-center text-center opacity-80 rotate-[-1deg]">
        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-text-chocolate">lock</span>
          <span className="font-black uppercase tracking-wider text-xs">Secure Checkout</span>
        </div>
        <div className="flex gap-3 grayscale opacity-60">
          <span className="material-symbols-outlined text-3xl">credit_card</span>
          <span className="material-symbols-outlined text-3xl">account_balance</span>
          <span className="material-symbols-outlined text-3xl">payments</span>
        </div>
      </div>
    </div>
  );
}
