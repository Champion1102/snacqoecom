"use client";
import { GrainOverlay } from '@/components/GrainOverlay';
import { CheckoutHeader } from '@/components/checkout/CheckoutHeader';
import { CheckoutFooter } from '@/components/checkout/CheckoutFooter';

type CheckoutStep = 'cart' | 'shipping' | 'payment';

interface CheckoutLayoutProps {
  children: React.ReactNode;
  step: CheckoutStep;
}

export function CheckoutLayout({ children, step }: CheckoutLayoutProps) {
  return (
    <div className="bg-background-light text-text-chocolate overflow-x-hidden selection:bg-accent-mango selection:text-text-chocolate min-h-screen flex flex-col">
      <GrainOverlay />
      <CheckoutHeader step={step} />
      <main className="relative flex-grow py-12 px-6">{children}</main>
      <CheckoutFooter />
    </div>
  );
}
