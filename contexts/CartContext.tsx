"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getCart } from '@/api/cart';
import type { CartItemResponse } from '@/api/cart';

interface CartContextValue {
  cartCount: number;
  cartItems: CartItemResponse[];
  refreshCart: () => Promise<void>;
  getQuantityForVariant: (variantId: string) => number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState<CartItemResponse[]>([]);

  const refreshCart = useCallback(async () => {
    try {
      const { cart } = await getCart();
      const items = cart?.items ?? [];
      setCartItems(items);
      const count = items.reduce((sum, i) => sum + i.quantity, 0);
      setCartCount(count);
    } catch {
      setCartCount(0);
      setCartItems([]);
    }
  }, []);

  const getQuantityForVariant = useCallback(
    (variantId: string) => {
      const item = cartItems.find((i) => i.variantId === variantId);
      return item?.quantity ?? 0;
    },
    [cartItems]
  );

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const value = useMemo(
    () => ({ cartCount, cartItems, refreshCart, getQuantityForVariant }),
    [cartCount, cartItems, refreshCart, getQuantityForVariant]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
