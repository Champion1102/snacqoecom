export interface CartItem {
  id: string;
  variantId: string;
  productId: string;
  name: string;
  variant?: string;
  imageUrl: string;
  imageBgClass?: string;
  icon?: string;
  price: string;
  quantity: number;
  badge?: string;
}

export interface CartSummary {
  subtotal: string;
  shipping: string;
  shippingFree: boolean;
  tax: string;
  total: string;
}
