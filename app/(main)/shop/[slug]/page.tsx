"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ProductHero } from "@/components/ProductHero";
import { ProductDetails } from "@/components/ProductDetails";
import { ProductCard } from "@/components/ProductCard";
import { ReviewCard } from "@/components/ReviewCard";
import {
  getProductBySlug,
  getProductReviews,
  formatPrice,
  type ProductResponse,
  type ProductReviewResponse,
} from "@/api/products";
import { getProducts } from "@/api/products";
import { addCartItem } from "@/api/cart";
import { useCart } from "@/contexts/CartContext";
import type { Product } from "@/types/product";
import type { ProductDetail, Review } from "@/types/productDetail";

function mapToProductDetail(p: ProductResponse): ProductDetail {
  const sortedImages = [...(p.images ?? [])].sort(
    (a, b) => a.sortOrder - b.sortOrder
  );
  const firstImage = sortedImages[0]?.url ?? "";
  const firstVariant = p.variants[0];
  const price = firstVariant ? formatPrice(firstVariant.price) : "₹0";
  const compareAtPrice = firstVariant?.compareAtPrice
    ? formatPrice(firstVariant.compareAtPrice)
    : undefined;
  const nameParts = p.name.split(" ");
  const titlePart1 = nameParts.slice(0, -1).join(" ") || p.name;
  const titlePart2 = nameParts[nameParts.length - 1] ?? "";

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    titlePart1,
    titlePart2,
    category: p.category?.name ?? "",
    categorySlug: p.category?.slug ?? "",
    description: p.shortDescription ?? p.description ?? "",
    longDescription: p.description,
    imageUrl: firstImage,
    images: sortedImages.length > 0 ? sortedImages : undefined,
    price,
    compareAtPrice,
    rating: 0,
    reviewCount: 0,
    sizes: p.variants.map((v) => ({
      id: v.id,
      label: v.name,
      sublabel: "",
      price: formatPrice(v.price),
      compareAtPrice: v.compareAtPrice ? formatPrice(v.compareAtPrice) : undefined,
      outOfStock: v.stock === 0 || v.outOfStock === true,
    })),
    descriptionContent: p.description,
    ingredients: p.ingredients ?? undefined,
    nutrition: (p.nutrition ?? undefined) || undefined,
  };
}

function mapToProduct(
  p: ProductResponse,
  options?: { tapeLabel?: string }
): Product {
  const sortedImages = [...(p.images ?? [])].sort(
    (a, b) => a.sortOrder - b.sortOrder
  );
  const firstImage = sortedImages[0]?.url;
  const firstVariant = p.variants[0];
  const price = firstVariant ? formatPrice(firstVariant.price) : "₹0";
  const outOfStock = firstVariant
    ? firstVariant.stock === 0 || firstVariant.outOfStock === true
    : false;
  const variants = p.variants?.map((v) => ({
    id: v.id,
    label: v.name.toUpperCase(),
    price: formatPrice(v.price),
    outOfStock: v.stock === 0 || v.outOfStock === true,
  }));
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    price,
    description: p.shortDescription ?? p.description ?? "",
    icon: "shopping_bag",
    iconBgColor: "bg-secondary",
    iconColor: "text-primary",
    tapeLabel: options?.tapeLabel ?? p.cardLabel ?? undefined,
    category: p.category?.slug ?? "all",
    defaultVariantId: firstVariant?.id,
    outOfStock,
    variants: variants ?? [],
    imageUrl: firstImage,
  };
}

function mapApiReviewToReview(r: ProductReviewResponse): Review {
  const body = r.text?.trim() ?? "";
  const firstLine = body.split(/\n/)[0]?.trim() ?? "";
  const author =
    [r.reviewerFirstName, r.reviewerLastName]
      .filter(Boolean)
      .join(" ")
      .trim() || "Snac Club Member";
  return {
    id: r.id,
    title: firstLine.slice(0, 60) || "Review",
    body: body || "No comment.",
    author,
    rating: r.rating ?? 5,
    imageUrls: r.imageUrls?.length ? r.imageUrls : undefined,
    videoUrl: r.videoUrl ?? undefined,
  };
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [productReviews, setProductReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { refreshCart } = useCart();

  useEffect(() => {
    if (!slug) return;
    getProductBySlug(slug)
      .then(({ product: p }) => setProduct(mapToProductDetail(p)))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    getProductReviews(slug)
      .then(({ reviews }) =>
        setProductReviews(reviews.map(mapApiReviewToReview))
      )
      .catch(() => setProductReviews([]));
  }, [slug]);

  useEffect(() => {
    if (!product) return;
    const reviewCount = productReviews.length;
    const averageRating =
      reviewCount > 0
        ? Math.round(
            productReviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount
          )
        : 0;
    setProduct((prev) =>
      prev ? { ...prev, rating: averageRating, reviewCount } : null
    );
  }, [productReviews]);

  useEffect(() => {
    if (!product?.categorySlug) return;
    getProducts({ category: product.categorySlug })
      .then(({ products: list }) => {
        const others = list
          .filter((p) => p.slug !== slug)
          .slice(0, 3)
          .map((p, i) =>
            mapToProduct(p, i === 0 ? { tapeLabel: "HOT" } : undefined)
          );
        setRelated(others);
      })
      .catch(() => setRelated([]));
  }, [product?.categorySlug, slug]);

  const handleAddToCart = async (
    _detail: ProductDetail,
    sizeId: string,
    quantity: number
  ) => {
    try {
      await addCartItem(sizeId, quantity);
      await refreshCart();
    } catch {
      // optional: toast error
    }
  };

  const handleRelatedAddToCart = async (p: Product, variantId?: string) => {
    const id = variantId ?? p.defaultVariantId;
    if (!id) return;
    try {
      await addCartItem(id, 1);
      await refreshCart();
    } catch {
      // optional: toast error
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">
          progress_activity
        </span>
      </div>
    );
  }

  if (!product) {
    router.replace("/shop");
    return null;
  }

  return (
    <div className="relative pt-4 sm:pt-8 pb-20 min-h-screen">
      <span
        className="absolute top-40 right-10 z-0 hidden lg:block animate-pulse material-symbols-outlined text-6xl text-accent-mango rotate-12"
        style={{ fontVariationSettings: "'FILL' 1" }}
        aria-hidden
      >
        star
      </span>
      <span
        className="absolute bottom-1/4 left-10 z-0 hidden lg:block material-symbols-outlined text-5xl text-primary -rotate-12"
        style={{ fontVariationSettings: "'FILL' 1" }}
        aria-hidden
      >
        favorite
      </span>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 lg:gap-20 items-start relative z-10">
        <ProductHero product={product} />
        <ProductDetails product={product} onAddToCart={handleAddToCart} />
      </div>

      {related.length > 0 && (
        <section className="mt-16 sm:mt-32 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-4 mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-5xl text-text-chocolate brand-font uppercase">
              You might also like
            </h2>
            <div className="h-1 flex-1 bg-text-chocolate border-dashed border-b-2 border-text-chocolate opacity-30" />
            <div className="hidden md:block transform rotate-12">
              <span className="hand-font text-primary text-xl">
                Don&apos;t stop now!
              </span>
            </div>
          </div>
          <div className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 md:grid md:grid-cols-3 md:overflow-visible md:gap-8 items-stretch">
            {related.map((p, index) => (
              <div
                key={p.id}
                className="flex-shrink-0 w-[260px] sm:w-[300px] snap-center md:w-auto min-h-0"
              >
                <ProductCard
                  product={p}
                  onAddToCart={handleRelatedAddToCart}
                  hoverRotate={index % 2 === 0 ? 1 : -1}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-16 sm:mt-32 max-w-7xl mx-auto px-4 sm:px-6 mb-20">
        <div className="relative mb-8 sm:mb-12 flex flex-col items-center text-center">
          <h2 className="product-font text-2xl sm:text-3xl md:text-5xl font-bold text-text-chocolate uppercase transform -rotate-1 relative z-10 inline-block">
            Real Talk from the <span className="text-primary">Snac Club</span>
          </h2>
        </div>
        {productReviews.length === 0 ? (
          <p className="text-text-chocolate/70 font-medium py-8 text-center">
            No reviews yet. Be the first to review after your order!
          </p>
        ) : (
          <div className="overflow-x-auto overflow-y-visible scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0 pb-4">
            <div className="flex flex-nowrap gap-6 snap-x snap-mandatory w-max">
              {productReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
