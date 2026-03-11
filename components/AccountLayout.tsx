"use client";
import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AccountSidebar } from '@/components/account/AccountSidebar';
import { useAuth } from '@/contexts/AuthContext';

export function AccountLayout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/login');
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto w-full px-6 py-8 pb-24 lg:pb-8 relative">
      <div className="absolute top-10 left-0 w-24 h-24 bg-accent-strawberry/10 rounded-full blur-2xl -z-10" aria-hidden />
      <div className="absolute bottom-10 right-0 w-32 h-32 bg-accent-mango/10 rounded-full blur-2xl -z-10" aria-hidden />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <AccountSidebar />
        <div className="lg:col-span-9 flex flex-col gap-8 min-w-0">
          <Link
            href="/shop"
            className="lg:hidden inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-accent-mango text-text-chocolate border-2 border-text-chocolate font-bold uppercase product-font text-sm shadow-[4px_4px_0px_0px_#2D1B0E] hover:shadow-[2px_2px_0px_0px_#2D1B0E] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
          >
            <span className="material-symbols-outlined text-xl">storefront</span>
            Back to Shop
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
}
