import type { UserProfile, SavedAddress, AccountOrder } from '@/types/account';

export const MOCK_USER: UserProfile = {
  name: 'Alex',
  firstName: 'Alex',
  lastName: 'Snacker',
  email: 'alex@snacqo.com',
  phone: '(555) 123-4567',
  birthday: '2003-08-15',
  newsletter: true,
};

export const MOCK_ADDRESSES: SavedAddress[] = [
  {
    id: 'addr-1',
    label: 'Home Base',
    recipientName: 'Tyler Durden',
    line1: '420 Paper St.',
    line2: 'Unit 101',
    city: 'Bradford',
    state: 'DE',
    zip: '19808',
    country: 'United States',
    phone: '(555) 019-2834',
    isDefault: true,
  },
  {
    id: 'addr-2',
    label: "The Office",
    recipientName: 'Tyler Durden',
    line1: '1500 Market St',
    line2: 'Suite 3400',
    city: 'Philadelphia',
    state: 'PA',
    zip: '19102',
    country: 'United States',
    phone: '(215) 555-9999',
    isDefault: false,
  },
  {
    id: 'addr-3',
    label: "Mom's House",
    recipientName: 'Marla Singer',
    line1: '5823 Regent St',
    line2: 'Apt 2B',
    city: 'Oakland',
    state: 'CA',
    zip: '94618',
    country: 'United States',
    phone: '(510) 555-0123',
    isDefault: false,
  },
];

const SAVORY_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuACOPwnRnUGo1McwOUsF0cTnOb7FTX8758uAG2IxMwQdlGbHyAwOSAMx60qOXG44ngnXSYodVCjefJMxlVTfZevr6dXlZg8uHh2Rq6OszKrGlOj7VRj_pHNy_NiXy9heb-g5zjEeiw5WiBOGgXRGWhAm_zfyYxoJUDJOQI2pCXtd36ZTYeNlGQJVj1czAkJIhnksQ8tI50Rn7ko-sJoMNfDH7VjNfjEd20FP9mBsNV38BdmkP04O2N-GD5HQaNWlmBBqBe4qpf6wwXV';
const CHOCO_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDJ4ENvO3OwegWUqYGKXgiWfssd4BsxBUKcKHUe-L0r6uaH7_siVNKfrjOIrO7d2YnvJlUM8psp4meOvlJ5Wd8l9sulDy9yvkdnbyiqvXgkjyebdfitH5DAlvhLKfyi3UGijV7JgSQnSHM3Bd_xUDwgdpcrxnL1HfzxpuF-jLw7r0jOqPfTv1vGcryZmtcZGDBV_RqtCua5xik0kDU1fdb_fNIv5tT9aybCTRc6iDPS6ijad6LaZdjAIoxoThN5tC8MvieT2OXyZcXK';
const PACK_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCaoVW3oRhsP1ECY6gpCRLsV0gayo64MRrJeDgcRMcIApR7iMzrtc_htG0Uu2tB3pF0RqDsDpYgdRVaSUJbX-YPeYBnIQmaN8RzfUU87reQlC44jTTemOJZJwSMiEF3ww58IvldCtVwbO4m0O27LXlxphC62yD5WtydAvJxnRkAkT4ROsyC4onF5RGE7K1_Gs0svTRPGroc1b0wvnKiH2IrHbF2ZnqchlUxfgNXChK7FXyqhzN_NYFahnv5HiZHVa2CZVttkhvhm1B8';

export const MOCK_DEFAULT_ADDRESS = MOCK_ADDRESSES[0];

export const MOCK_ACCOUNT_ORDERS: AccountOrder[] = [
  {
    id: 'ord-1',
    orderNumber: '88210',
    status: 'processing',
    placedAt: 'Oct 24, 2024',
    total: '$42.50',
    estDelivery: 'Oct 28',
    itemThumbnails: [
      { imageUrl: SAVORY_IMG, quantity: 2 },
      { imageUrl: CHOCO_IMG, quantity: 1 },
    ],
  },
  {
    id: 'ord-2',
    orderNumber: '81004',
    status: 'delivered',
    placedAt: 'Sep 12, 2024',
    total: '$65.00',
    itemThumbnails: [
      { imageUrl: PACK_IMG, quantity: 4 },
      { icon: 'local_fire_department', quantity: 2 },
      { imageUrl: CHOCO_IMG, quantity: 1 },
    ],
  },
  {
    id: 'ord-3',
    orderNumber: '75022',
    status: 'delivered',
    placedAt: 'Aug 05, 2024',
    total: '$28.00',
    itemThumbnails: [
      { imageUrl: SAVORY_IMG, quantity: 1 },
      { imageUrl: CHOCO_IMG, quantity: 1 },
    ],
  },
];

export const MOCK_RECENT_ORDERS_OVERVIEW = [
  { orderNumber: 'SNK-9928', date: 'Oct 24, 2023', total: '$42.50', status: 'Delivered' as const },
  { orderNumber: 'SNK-8812', date: 'Sep 12, 2023', total: '$28.00', status: 'Completed' as const },
];
