export interface ShippingFormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  saveInfo: boolean;
}

export interface CheckoutOrderItem {
  id: string;
  name: string;
  variant: string;
  imageUrl: string;
  quantity: number;
  price: string;
  /** Unit price in paise (for showing quantity × price = line total) */
  pricePaise?: number;
}

export interface OrderConfirmed {
  orderId: string;
  items: { name: string; variant: string; quantity: number; category?: string; icon?: string }[];
  total: string;
  shippingAddress: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}
