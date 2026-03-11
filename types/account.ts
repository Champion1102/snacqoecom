export interface UserProfile {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthday: string; // ISO date or display format
  newsletter: boolean;
}

export interface SavedAddress {
  id: string;
  label: string;
  recipientName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export type OrderStatus = 'processing' | 'delivered' | 'cancelled' | 'pending' | 'shipped' | 'out_for_delivery';

export interface AccountOrder {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  placedAt: string;
  total: string;
  estDelivery?: string;
  itemThumbnails: { imageUrl?: string; icon?: string; quantity: number }[];
  hasReview?: boolean;
}
