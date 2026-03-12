"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { CartItemCard } from "@/components/cart/CartItemCard";
import { CartOrderSummary } from "@/components/cart/CartOrderSummary";
import {
  getCart,
  updateCartItemQuantity,
  removeCartItem,
  type CartItemResponse,
} from "@/api/cart";
import { useCart } from "@/contexts/CartContext";
import { getStandardShippingPaise } from "@/lib/shipping";
import type { CartItem, CartSummary } from "@/types/cart";

function formatPrice(paise: number): string {
  return `₹${(paise / 100).toFixed(2)}`;
}

function mapCartItem(item: CartItemResponse): CartItem {
  const v = item.variant;
  const product = v?.product;
  const imageUrl = product?.images?.[0]?.url ?? "";
  return {
    id: item.id,
    variantId: item.variantId,
    productId: product?.id ?? "",
    name: product?.name ?? "",
    variant: v?.name,
    imageUrl,
    price: formatPrice(v?.price ?? 0),
    quantity: item.quantity,
  };
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [summaryInView, setSummaryInView] = useState(false);
  const [scrolledPastSummary, setScrolledPastSummary] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const { refreshCart } = useCart();

  useEffect(() => {
    const el = summaryRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting;
        setSummaryInView(inView);
        if (inView) {
          setScrolledPastSummary(false);
        } else if (entry.boundingClientRect.top < 0) {
          setScrolledPastSummary(true);
        }
      },
      { threshold: 0, rootMargin: "0px 0px -80px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [items.length]);

  useEffect(() => {
    getCart()
      .then(({ cart }) => {
        setItems((cart?.items ?? []).map(mapCartItem));
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const summary: CartSummary = useMemo(() => {
    let subtotalPaise = 0;
    for (const item of items) {
      const match = item.price.replace(/[^0-9.]/g, "");
      const rupees = parseFloat(match) || 0;
      subtotalPaise += Math.round(rupees * 100 * item.quantity);
    }
    const subtotal = formatPrice(subtotalPaise);
    const shippingPaise = getStandardShippingPaise(subtotalPaise);
    const shippingFree = shippingPaise === 0;
    const shipping = shippingFree ? "Free" : formatPrice(shippingPaise);
    const totalPaise = subtotalPaise + shippingPaise;
    return {
      subtotal,
      shipping,
      shippingFree,
      tax: "—",
      total: formatPrice(totalPaise),
    };
  }, [items]);

  const handleQuantityChange = async (id: string, delta: number) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const newQty = Math.max(0, item.quantity + delta);
    if (newQty === 0) {
      await handleRemove(id);
      return;
    }
    try {
      await updateCartItemQuantity(item.variantId, newQty);
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, quantity: newQty } : i))
      );
      await refreshCart();
    } catch {
      getCart().then(({ cart }) =>
        setItems((cart?.items ?? []).map(mapCartItem))
      );
    }
  };

  const handleRemove = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    try {
      await removeCartItem(item.variantId);
      setItems((prev) => prev.filter((i) => i.id !== id));
      await refreshCart();
    } catch {
      getCart().then(({ cart }) =>
        setItems((cart?.items ?? []).map(mapCartItem))
      );
    }
  };

  if (loading) {
    return (
      <div className="pt-8 pb-20 px-6 max-w-7xl mx-auto flex justify-center py-32">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">
          progress_activity
        </span>
      </div>
    );
  }

  return (
    <div className="pt-8 pb-20 px-4 sm:px-6 max-w-7xl mx-auto w-full flex-grow relative z-10">
      <span
        className="absolute top-40 left-0 -z-10 animate-pulse hidden lg:block material-symbols-outlined text-8xl text-secondary/50 -rotate-12"
        style={{ fontVariationSettings: "'FILL' 1" }}
        aria-hidden
      >
        local_mall
      </span>
      <span
        className="absolute top-60 right-10 -z-10 hidden lg:block material-symbols-outlined text-7xl text-accent-strawberry/20 rotate-12 animate-bounce duration-[3000ms]"
        style={{ fontVariationSettings: "'FILL' 1" }}
        aria-hidden
      >
        favorite
      </span>

      <Link
        href="/shop"
        className="md:hidden flex items-center gap-2 text-text-chocolate font-bold text-sm mb-4 w-fit hover:text-primary transition-colors"
      >
        <span className="material-symbols-outlined text-xl">arrow_back</span>
        Back to shop
      </Link>

      <div className="mb-6 md:mb-10 relative">
        <h1 className="text-3xl sm:text-5xl md:text-6xl text-text-chocolate brand-font uppercase leading-none text-center sm:text-left">
          Your Stash
        </h1>
        <div
          className="h-3 w-full bg-accent-mango absolute bottom-2 left-0 -z-10 -rotate-1 transform translate-y-1 hidden sm:block"
          aria-hidden
        />
        <div className="absolute -top-6 -right-12 rotate-12 hidden md:block">
          <span className="hand-font text-primary text-xl">
            Treat yo&apos; self!
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-12 items-start pb-24 md:pb-20">
        <div className="w-full lg:w-2/3 flex flex-col gap-3 sm:gap-6 relative lg:z-0">
          {items.length === 0 ? (
            <p className="product-font text-lg sm:text-xl text-text-chocolate/80 text-center sm:text-left">
              Your stash is empty. Time to snack different!
            </p>
          ) : (
            items.map((item) => (
              <CartItemCard
                key={item.id}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemove}
              />
            ))
          )}
        </div>
        {items.length > 0 && (
          <div
            ref={summaryRef}
            className="w-full lg:w-1/3 lg:min-w-[360px] lg:flex-shrink-0 relative z-20 lg:z-20"
          >
            <CartOrderSummary summary={summary} />
          </div>
        )}
      </div>

      {items.length > 0 && !summaryInView && !scrolledPastSummary && (
        <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-white border-t-4 border-text-chocolate shadow-[0_-4px_20px_rgba(0,0,0,0.12)] px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] [isolation:isolate]">
          <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
            <div>
              <p className="text-xs font-bold text-text-chocolate/70 uppercase tracking-wider">
                Total
              </p>
              <p className="brand-font text-xl font-bold text-text-chocolate">
                {summary.total}
              </p>
            </div>
            <Link
              href="/checkout"
              className="flex-shrink-0 py-3 px-5 bg-accent-mango text-text-chocolate border-2 border-text-chocolate font-black uppercase tracking-wide text-sm flex items-center gap-2 shadow-[4px_4px_0px_0px_#2D1B0E] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#2D1B0E] transition-all"
            >
              Proceed to Checkout
              <span className="material-symbols-outlined text-lg font-bold">
                arrow_forward
              </span>
            </Link>
          </div>
          <div className="flex items-center justify-center gap-1.5 mt-2 text-text-chocolate/60">
            <span className="material-symbols-outlined text-sm">lock</span>
            <span className="text-[10px] font-bold">Secure SSL Encryption</span>
          </div>
        </div>
      )}
    </div>
  );
}
