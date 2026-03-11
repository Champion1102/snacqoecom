"use client";
import Link from 'next/link'
import { GrainOverlay } from '@/components/GrainOverlay';
import { Logo } from '@/components/Logo';

interface OrderConfirmedLayoutProps {
  children: React.ReactNode;
}

export function OrderConfirmedLayout({ children }: OrderConfirmedLayoutProps) {
  return (
    <div className="bg-background-light text-text-chocolate overflow-x-hidden selection:bg-accent-mango selection:text-text-chocolate min-h-screen flex flex-col">
      <GrainOverlay />
      <header className="fixed top-0 left-0 w-full z-40 px-6 py-4 transition-all duration-300 bg-white/90 backdrop-blur-md border-b-2 border-text-chocolate">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo size="sm" />
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/shop"
              className="text-base font-black uppercase tracking-wide text-text-chocolate hover:text-primary transition-colors btn-text"
            >
              Shop
            </Link>
            <Link
              href="/account"
              className="text-base font-black uppercase tracking-wide text-text-chocolate hover:text-primary transition-colors btn-text"
            >
              Account
            </Link>
          </nav>
        </div>
      </header>
      <main className="relative flex-grow">{children}</main>
      <footer className="bg-secondary py-8 border-t-4 border-text-chocolate text-center relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <Link href="/" className="snacqo-logo scale-75 mb-4 mx-auto opacity-50 grayscale inline-block">
            <span className="brand-font text-2xl text-text-chocolate tracking-tight">snac</span>
            <span className="brand-font text-4xl text-text-chocolate tracking-tighter">QO</span>
          </Link>
          <p className="text-sm font-bold text-text-chocolate/60">© 2025 snacQO Snacks Inc.</p>
        </div>
      </footer>
    </div>
  );
}
