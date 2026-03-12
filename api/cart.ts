import { request } from './client';

export interface CartItemVariantResponse {
  id: string;
  name: string;
  sku: string;
  price: number;
  compareAtPrice: number | null;
  product: {
    id: string;
    slug: string;
    name: string;
    images: { url: string }[];
  };
}

export interface CartItemResponse {
  id: string;
  variantId: string;
  quantity: number;
  variant: CartItemVariantResponse;
}

export interface CartResponse {
  cart: {
    id: string | null;
    items: CartItemResponse[];
  };
}

export function getCart(): Promise<CartResponse> {
  return request<CartResponse>('/api/cart');
}

export function addCartItem(variantId: string, quantity = 1): Promise<CartResponse> {
  return request<CartResponse>('/api/cart', { method: 'POST', body: { variantId, quantity } });
}

export function updateCartItemQuantity(variantId: string, quantity: number): Promise<CartResponse> {
  return request<CartResponse>(`/api/cart/items/${encodeURIComponent(variantId)}`, {
    method: 'PATCH',
    body: { quantity },
  });
}

export function removeCartItem(variantId: string): Promise<CartResponse> {
  return request<CartResponse>(`/api/cart/items/${encodeURIComponent(variantId)}`, { method: 'DELETE' });
}
