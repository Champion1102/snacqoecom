"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { getCart } from '@/api/cart';
import type { CartItemResponse } from '@/api/cart';
import { useAuth } from '@/contexts/AuthContext';

type CartPayload = { id: string | null; items: CartItemResponse[] };

interface CartContextValue {
  cartCount: number;
  cartItems: CartItemResponse[];
  refreshCart: () => Promise<void>;
  setCartFromResponse: (cart: CartPayload) => void;
  optimisticIncrement: (amount?: number) => void;
  getQuantityForVariant: (variantId: string) => number;
}

const CartContext = createContext<CartContextValue | null>(null);

const emptyCart: CartPayload = { id: null, items: [] };

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState<CartItemResponse[]>([]);
  const { isLoggedIn } = useAuth();
  const prevLoggedInRef = useRef<boolean | undefined>(undefined);

  const setCartFromResponse = useCallback((cart: CartPayload) => {
    const items = cart?.items ?? [];
    setCartItems(items);
    setCartCount(items.reduce((sum, i) => sum + i.quantity, 0));
  }, []);

  const optimisticIncrement = useCallback((amount = 1) => {
    setCartCount((c) => c + amount);
  }, []);

  const refreshCart = useCallback(async () => {
    try {
      const { cart } = await getCart();
      setCartFromResponse(cart ?? emptyCart);
    } catch {
      setCartCount(0);
      setCartItems([]);
    }
  }, [setCartFromResponse]);

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

  useEffect(() => {
    if (prevLoggedInRef.current === undefined) {
      prevLoggedInRef.current = isLoggedIn;
      return;
    }
    if (prevLoggedInRef.current !== isLoggedIn) {
      if (!isLoggedIn) {
        setCartFromResponse(emptyCart);
      }
      refreshCart();
      prevLoggedInRef.current = isLoggedIn;
    }
  }, [isLoggedIn, setCartFromResponse, refreshCart]);

  const value = useMemo(
    () => ({
      cartCount,
      cartItems,
      refreshCart,
      setCartFromResponse,
      optimisticIncrement,
      getQuantityForVariant,
    }),
    [cartCount, cartItems, refreshCart, setCartFromResponse, optimisticIncrement, getQuantityForVariant]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
