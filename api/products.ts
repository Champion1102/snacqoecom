import { request } from './client';

export interface ProductVariantResponse {
  id: string;
  name: string;
  sku: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  weightGrams?: number | null;
  outOfStock?: boolean;
}

export interface ProductImageResponse {
  id: string;
  url: string;
  sortOrder: number;
}

export interface ProductResponse {
  id: string;
  slug: string;
  name: string;
  description?: string;
  shortDescription: string | null;
  cardLabel?: string | null;
  ingredients?: string | null;
  nutrition?: { label: string; value: string }[] | null;
  sortOrder: number;
  category: { id: string; name: string; slug: string };
  images: ProductImageResponse[];
  variants: ProductVariantResponse[];
}

export function getProducts(params?: { category?: string; sort?: string }): Promise<{ products: ProductResponse[] }> {
  const search = new URLSearchParams();
  if (params?.category) search.set('category', params.category);
  if (params?.sort) search.set('sort', params.sort);
  const qs = search.toString();
  return request(`/products${qs ? `?${qs}` : ''}`);
}

export function getProductBySlug(slug: string): Promise<{ product: ProductResponse }> {
  return request(`/api/products/${encodeURIComponent(slug)}`);
}

export interface ProductReviewResponse {
  id: string;
  rating: number | null;
  text: string | null;
  imageUrls: string[];
  videoUrl: string | null;
  reviewerFirstName: string | null;
  reviewerLastName: string | null;
  createdAt: string;
}

export function getProductReviews(slug: string): Promise<{ reviews: ProductReviewResponse[] }> {
  return request(`/api/products/${encodeURIComponent(slug)}/reviews`);
}

export function formatPrice(paise: number): string {
  return `₹${(paise / 100).toFixed(2)}`;
}
