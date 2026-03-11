import type { ProductDetail, Review } from '@/types/productDetail';

const MANGO_KULFI_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDJ4ENvO3OwegWUqYGKXgiWfssd4BsxBUKcKHUe-L0r6uaH7_siVNKfrjOIrO7d2YnvJlUM8psp4meOvlJ5Wd8l9sulDy9yvkdnbyiqvXgkjyebdfitH5DAlvhLKfyi3UGijV7JgSQnSHM3Bd_xUDwgdpcrxnL1HfzxpuF-jLw7r0jOqPfTv1vGcryZmtcZGDBV_RqtCua5xik0kDU1fdb_fNIv5tT9aybCTRc6iDPS6ijad6LaZdjAIoxoThN5tC8MvieT2OXyZcXK';

export const MOCK_PRODUCT_DETAIL: ProductDetail = {
  id: 'mango-kesar-kulfi',
  slug: 'mango-kesar-kulfi',
  name: 'Mango Kesar Kulfi Cashew',
  titlePart1: 'Mango Kesar',
  titlePart2: 'Kulfi',
  category: 'Cashews',
  categorySlug: 'cashews',
  description:
    'The royal taste of Indian summers, now in a crunch. Premium cashews glazed with real Alphonso mango and saffron. No melt, all vibe.',
  longDescription:
    "Forget the dripping mess of a melting kulfi. We've captured that exact rich, creamy, saffron-infused magic and wrapped it around our premium roasted cashews. It's the nostalgia of Indian summers in a bite-sized, crunchy format. Warning: Highly addictive.",
  imageUrl: MANGO_KULFI_IMAGE,
  caption: 'Pure Nostalgia 🥭',
  badge: 'New Drop!',
  price: '$14.00',
  compareAtPrice: '$18.00',
  rating: 5,
  reviewCount: 42,
  sizes: [
    { id: '50g', label: '50g', sublabel: 'Snack Pack', price: '$8.00' },
    { id: '100g', label: '100g', sublabel: 'Shareable (?)', price: '$14.00' },
  ],
  descriptionContent:
    "Forget the dripping mess of a melting kulfi. We've captured that exact rich, creamy, saffron-infused magic and wrapped it around our premium roasted cashews. It's the nostalgia of Indian summers in a bite-sized, crunchy format. Warning: Highly addictive.",
  ingredients:
    'Roasted Cashews, Sugar, Milk Solids, Cocoa Butter, Saffron, Cardamom, Natural Mango Flavor, Sea Salt.',
  nutrition: [
    { label: 'Calories', value: '160kcal' },
    { label: 'Protein', value: '5g' },
    { label: 'Fat', value: '12g' },
    { label: 'Carbs', value: '9g' },
  ],
  swatches: ['bg-accent-mango/20', 'bg-primary/20', 'bg-secondary/20'],
};

export const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    title: 'Literally Obsessed',
    body: '"Okay I was skeptical about mango on cashews but WOW. It tastes like actual kulfi but crunchy? My stash lasted exactly 2 days. Need a subscription ASAP."',
    author: '@priya_eats',
    rating: 5,
  },
  {
    id: '2',
    title: 'No Cap, Best Snack',
    body: '"Brought these to a party and they were gone in 5 mins. The saffron hint is so bougie but in a good way. Buying the 100g pack next time for sure."',
    author: '@rahul_dev',
    rating: 5,
    tag: 'TOP PICK',
  },
  {
    id: '3',
    title: 'Main Character Energy',
    body: '"Finally a snack that isn\'t just spicy or salty. This is sweet, rich, and feels premium. Packaging is 10/10 too, looks great on my feed lol."',
    author: '@zara_styles',
    rating: 5,
  },
  {
    id: '4',
    title: 'Summer in a Bite',
    body: '"If you miss those mango seasons, this is it. The kulfi flavor is spot on. Legit tasted like I was back home. Highly recommend!"',
    author: '@arjun_k',
    rating: 5,
  },
];

export function getProductDetailById(id: string): ProductDetail | undefined {
  if (id === 'mango-kesar-kulfi' || id === '2') return MOCK_PRODUCT_DETAIL;
  return undefined;
}
