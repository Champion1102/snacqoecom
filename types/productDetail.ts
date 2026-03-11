export interface ProductSizeOption {
  id: string;
  label: string;
  sublabel: string;
  price: string;
  compareAtPrice?: string;
  outOfStock?: boolean;
}

export interface ProductImageOption {
  id: string;
  url: string;
  sortOrder: number;
}

export interface ProductDetail {
  id: string;
  slug?: string;
  name: string;
  /** Main title part (e.g. "Mango Kesar") */
  titlePart1: string;
  /** Accent title part (e.g. "Kulfi") */
  titlePart2: string;
  category: string;
  categorySlug: string;
  description: string;
  longDescription?: string;
  imageUrl: string;
  /** All product images for gallery (sorted by sortOrder) */
  images?: ProductImageOption[];
  /** Optional polaroid caption (handwritten style) */
  caption?: string;
  badge?: string;
  price: string;
  compareAtPrice?: string;
  rating: number;
  reviewCount: number;
  sizes: ProductSizeOption[];
  /** Accordion: full description */
  descriptionContent?: string;
  /** Accordion: ingredients list */
  ingredients?: string;
  /** Accordion: nutrition list */
  nutrition?: { label: string; value: string }[];
  /** Swatch colors for variant selector (Tailwind bg classes) */
  swatches?: string[];
}

export interface Review {
  id: string;
  title: string;
  body: string;
  author: string;
  rating: number;
  tag?: 'TOP PICK';
  imageUrls?: string[];
  videoUrl?: string | null;
}
