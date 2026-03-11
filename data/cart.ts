import type { CartItem, CartSummary } from '@/types/cart';

const CHOCO_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDJ4ENvO3OwegWUqYGKXgiWfssd4BsxBUKcKHUe-L0r6uaH7_siVNKfrjOIrO7d2YnvJlUM8psp4meOvlJ5Wd8l9sulDy9yvkdnbyiqvXgkjyebdfitH5DAlvhLKfyi3UGijV7JgSQnSHM3Bd_xUDwgdpcrxnL1HfzxpuF-jLw7r0jOqPfTv1vGcryZmtcZGDBV_RqtCua5xik0kDU1fdb_fNIv5tT9aybCTRc6iDPS6ijad6LaZdjAIoxoThN5tC8MvieT2OXyZcXK';

export const MOCK_CART_ITEMS: CartItem[] = [
  {
    id: 'cart-1',
    variantId: 'var-1',
    productId: '3',
    name: 'The Chocolatey One',
    variant: 'Single Pack (150g)',
    imageUrl: CHOCO_IMAGE,
    imageBgClass: 'bg-secondary',
    price: '$18.00',
    quantity: 2,
  },
  {
    id: 'cart-2',
    variantId: 'var-2',
    productId: '2',
    name: 'The Royal Treat',
    variant: 'Bundle (3 Pack)',
    imageUrl: '',
    imageBgClass: 'bg-[#FFF8E1]',
    icon: 'emoji_events',
    price: '$24.00',
    quantity: 1,
    badge: 'Best Seller',
  },
  {
    id: 'cart-3',
    variantId: 'var-3',
    productId: '1',
    name: 'The Savory Hit',
    variant: 'Spicy Pizza Almonds',
    imageUrl: '',
    imageBgClass: 'bg-[#FFEBEE]',
    icon: 'local_fire_department',
    price: '$27.00',
    quantity: 3,
  },
];

export const MOCK_CART_SUMMARY: CartSummary = {
  subtotal: '$69.00',
  shipping: 'FREE',
  shippingFree: true,
  tax: '$5.52',
  total: '$74.52',
};
