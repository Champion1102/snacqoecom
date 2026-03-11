"use client";
import Link from 'next/link'

export function CheckoutFooter() {
  return (
    <footer className="bg-text-chocolate py-8 mt-12 border-t-4 border-white">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-white/60 text-sm font-bold">
        <p>© 2025 snacQO Snacks Inc.</p>
        <div className="flex gap-6">
          <Link href="/return-refund-policy" className="hover:text-white transition-colors">
            Refund Policy
          </Link>
          <a href="#" className="hover:text-white transition-colors">
            Shipping Policy
          </a>
          <Link href="/terms-and-conditions" className="hover:text-white transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
