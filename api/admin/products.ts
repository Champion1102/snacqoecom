import { request, requestMultipart } from '@/api/client';

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

export interface ProductImage {
  id: string;
  url: string;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  weightGrams: number | null;
  isActive: boolean;
  outOfStock: boolean;
}

export interface NutritionRow {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  description: string;
  shortDescription: string | null;
  ingredients: string | null;
  nutrition: NutritionRow[] | null;
  cardLabel: string | null;
  isActive: boolean;
  sortOrder: number;
  category: ProductCategory;
  images: ProductImage[];
  variants: ProductVariant[];
}

export interface ProductListResponse {
  products: Product[];
}

export interface ProductDetailResponse {
  product: Product;
}

export interface CreateProductBody {
  name: string;
  slug: string;
  categoryId: string;
  description?: string;
  shortDescription?: string | null;
  ingredients?: string | null;
  nutrition?: NutritionRow[] | null;
  cardLabel?: string | null;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateProductBody {
  name?: string;
  slug?: string;
  categoryId?: string;
  description?: string;
  shortDescription?: string | null;
  ingredients?: string | null;
  nutrition?: NutritionRow[] | null;
  cardLabel?: string | null;
  isActive?: boolean;
  sortOrder?: number;
}

export interface CreateVariantBody {
  name: string;
  sku: string;
  price: number;
  compareAtPrice?: number | null;
  stock?: number;
  weightGrams?: number | null;
  outOfStock?: boolean;
}

export interface UpdateVariantBody {
  name?: string;
  sku?: string;
  price?: number;
  compareAtPrice?: number | null;
  stock?: number;
  weightGrams?: number | null;
  outOfStock?: boolean;
}

export function getProducts(params?: {
  category?: string;
  active?: boolean;
}): Promise<ProductListResponse> {
  const search = new URLSearchParams();
  if (params?.category) search.set('category', params.category);
  if (params?.active !== undefined) search.set('active', String(params.active));
  const qs = search.toString();
  return request<ProductListResponse>(`/api/admin/products${qs ? `?${qs}` : ''}`);
}

export function getProductById(id: string): Promise<ProductDetailResponse> {
  return request<ProductDetailResponse>(`/api/admin/products/${id}`);
}

export function createProduct(body: CreateProductBody): Promise<ProductDetailResponse> {
  return request<ProductDetailResponse>('/api/admin/products', {
    method: 'POST',
    body: {
      name: body.name,
      slug: body.slug,
      categoryId: body.categoryId,
      description: body.description ?? '',
      shortDescription: body.shortDescription ?? null,
      ingredients: body.ingredients ?? null,
      nutrition: body.nutrition ?? null,
      cardLabel: body.cardLabel ?? null,
      isActive: body.isActive !== false,
      sortOrder: body.sortOrder ?? 0,
    },
  });
}

export function updateProduct(id: string, body: UpdateProductBody): Promise<ProductDetailResponse> {
  return request<ProductDetailResponse>(`/api/admin/products/${id}`, {
    method: 'PATCH',
    body,
  });
}

/** Soft delete (sets isActive false). Returns updated product. */
export function deleteProduct(id: string): Promise<ProductDetailResponse> {
  return request<ProductDetailResponse>(`/api/admin/products/${id}`, { method: 'DELETE' });
}

export function addVariant(
  productId: string,
  body: CreateVariantBody
): Promise<{ variant: ProductVariant; product: Product }> {
  return request<{ variant: ProductVariant; product: Product }>(
    `/api/admin/products/${productId}/variants`,
    { method: 'POST', body: body as unknown as Record<string, unknown> }
  );
}

export function updateVariant(
  productId: string,
  variantId: string,
  body: UpdateVariantBody
): Promise<{ variant: ProductVariant }> {
  return request<{ variant: ProductVariant }>(
    `/api/admin/products/${productId}/variants/${variantId}`,
    { method: 'PATCH', body: body as unknown as Record<string, unknown> }
  );
}

export function deleteVariant(productId: string, variantId: string): Promise<void> {
  return request<void>(`/api/admin/products/${productId}/variants/${variantId}`, {
    method: 'DELETE',
  });
}

export function uploadProductImages(
  productId: string,
  files: File[]
): Promise<{ images: ProductImage[] }> {
  const formData = new FormData();
  files.forEach((f) => formData.append('images', f));
  return requestMultipart<{ images: ProductImage[] }>(
    `/api/admin/products/${productId}/images`,
    formData
  );
}

export function updateImageSortOrder(
  productId: string,
  imageId: string,
  sortOrder: number
): Promise<{ image: ProductImage }> {
  return request<{ image: ProductImage }>(
    `/api/admin/products/${productId}/images/${imageId}`,
    { method: 'PATCH', body: { sortOrder } }
  );
}

export function deleteProductImage(productId: string, imageId: string): Promise<void> {
  return request<void>(`/api/admin/products/${productId}/images/${imageId}`, {
    method: 'DELETE',
  });
}

export function formatPaise(paise: number): string {
  return `₹${(paise / 100).toFixed(2)}`;
}
