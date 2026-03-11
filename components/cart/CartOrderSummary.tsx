"use client";
import Link from 'next/link'
import type { CartSummary } from '@/types/cart';

interface CartOrderSummaryProps {
  summary: CartSummary;
}

export function CartOrderSummary({ summary }: CartOrderSummaryProps) {
  return (
    <div className="w-full min-w-0 sticky top-36 isolate">
      <div className="w-full min-w-0 bg-white rounded-xl border-4 border-text-chocolate p-4 sm:p-6 md:p-8 sm:rotate-1 sm:hover:rotate-0 transition-transform duration-300 relative z-10 shadow-[6px_6px_0px_0px_#2D1B0E] overflow-visible">
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 tape-strip z-20 hidden sm:block"
          aria-hidden
        />
        <h2 className="text-lg sm:text-2xl brand-font text-text-chocolate mb-4 sm:mb-6 border-b-2 border-text-chocolate pb-2 uppercase">
          Order Summary
        </h2>
        <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
          <div className="flex justify-between items-center gap-2 text-sm sm:text-lg font-medium">
            <span className="text-text-chocolate/80 shrink-0">Subtotal</span>
            <span className="product-font font-bold text-text-chocolate">{summary.subtotal}</span>
          </div>
          <div className="flex justify-between items-center gap-2 text-sm sm:text-lg font-medium">
            <span className="text-text-chocolate/80 shrink-0">Shipping</span>
            <span className={`product-font font-bold text-right ${summary.shippingFree ? 'text-accent-mango' : 'text-text-chocolate'}`}>
              {summary.shipping}
            </span>
          </div>
          <div className="flex justify-between items-center gap-2 text-sm sm:text-lg font-medium">
            <span className="text-text-chocolate/80 shrink-0">Tax</span>
            <span className="product-font font-bold text-text-chocolate">{summary.tax}</span>
          </div>
        </div>
        <p className="flex items-center gap-2 text-sm font-bold text-primary mb-4">
          <span className="material-symbols-outlined text-base">local_shipping</span>
          Free delivery on orders above ₹499
        </p>
        <div className="border-t-2 border-dashed border-text-chocolate/30 pt-4 mb-6 sm:mb-8">
          <div className="flex justify-between items-end gap-2">
            <span className="brand-font text-base sm:text-xl text-text-chocolate font-bold shrink-0">Total</span>
            <span className="brand-font text-2xl sm:text-4xl text-text-chocolate font-bold">{summary.total}</span>
          </div>
        </div>
        <Link
          href="/checkout"
          className="w-full py-3 sm:py-4 bg-accent-mango sm:bg-primary text-text-chocolate sm:text-white text-base sm:text-xl border-2 border-text-chocolate font-black uppercase tracking-wide flex items-center justify-center gap-2 group shadow-[4px_4px_0px_0px_#2D1B0E] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#2D1B0E] transition-all whitespace-nowrap"
        >
          Proceed to Checkout
          <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform font-bold shrink-0">
            arrow_forward
          </span>
        </Link>
        <div className="mt-4 sm:mt-6 flex items-center justify-center gap-2 text-text-chocolate/70">
          <span className="material-symbols-outlined text-lg">lock</span>
          <span className="text-xs font-bold">Secure SSL Encryption</span>
        </div>
      </div>
    </div>
  );
}
