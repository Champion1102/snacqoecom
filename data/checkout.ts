import type { CheckoutOrderItem } from '@/types/checkout';

const CHOCO_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDJ4ENvO3OwegWUqYGKXgiWfssd4BsxBUKcKHUe-L0r6uaH7_siVNKfrjOIrO7d2YnvJlUM8psp4meOvlJ5Wd8l9sulDy9yvkdnbyiqvXgkjyebdfitH5DAlvhLKfyi3UGijV7JgSQnSHM3Bd_xUDwgdpcrxnL1HfzxpuF-jLw7r0jOqPfTv1vGcryZmtcZGDBV_RqtCua5xik0kDU1fdb_fNIv5tT9aybCTRc6iDPS6ijad6LaZdjAIoxoThN5tC8MvieT2OXyZcXK';
const SAVORY_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuACOPwnRnUGo1McwOUsF0cTnOb7FTX8758uAG2IxMwQdlGbHyAwOSAMx60qOXG44ngnXSYodVCjefJMxlVTfZevr6dXlZg8uHh2Rq6OszKrGlOj7VRj_pHNy_NiXy9heb-g5zjEeiw5WiBOGgXRGWhAm_zfyYxoJUDJOQI2pCXtd36ZTYeNlGQJVj1czAkJIhnksQ8tI50Rn7ko-sJoMNfDH7VjNfjEd20FP9mBsNV38BdmkP04O2N-GD5HQaNWlmBBqBe4qpf6wwXV';

export const MOCK_CHECKOUT_ITEMS: CheckoutOrderItem[] = [
  {
    id: 'co-1',
    name: 'The Chocolatey One',
    variant: 'Pack of 6',
    imageUrl: CHOCO_IMAGE,
    quantity: 2,
    price: '$24.00',
  },
  {
    id: 'co-2',
    name: 'The Savory Hit',
    variant: 'Pack of 6',
    imageUrl: SAVORY_IMAGE,
    quantity: 1,
    price: '$24.00',
  },
];

export const MOCK_ORDER_CONFIRMED = {
  orderId: '#SQ-88294',
  items: [
    { name: 'The Royal Treat', variant: 'Cashews • Mango Glazed', quantity: 2, icon: 'emoji_events' as const },
    { name: 'The Savory Hit', variant: 'Almonds • Pizza Spice', quantity: 1, icon: 'local_fire_department' as const },
  ],
  total: '$42.00',
  shippingAddress: {
    name: 'Alex Snacker',
    line1: '123 Crunch Blvd, Apt 4B',
    line2: '',
    city: 'Flavor Town',
    state: 'CA',
    zip: '90210',
    country: 'United States',
  },
};
