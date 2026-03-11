"use client";
import { useMemo, useState, useEffect } from "react";
import { ProductCard } from "@/components/ProductCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import type { Product } from "@/types/product";
import { getCategories } from "@/api/categories";
import { getProducts, formatPrice, type ProductResponse } from "@/api/products";
import { addCartItem } from "@/api/cart";
import { useCart } from "@/contexts/CartContext";

function mapProduct(p: ProductResponse): Product {
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
    tapeLabel: p.cardLabel ?? undefined,
    category: p.category?.slug ?? "all",
    defaultVariantId: firstVariant?.id,
    outOfStock,
    variants,
    imageUrl: firstImage,
  };
}

export default function ShopPage() {
  const [categories, setCategories] = useState<{ id: string; label: string }[]>([
    { id: "all", label: "ALL" },
  ]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const { refreshCart } = useCart();

  useEffect(() => {
    getCategories()
      .then(({ categories: list }) => {
        setCategories([
          { id: "all", label: "ALL" },
          ...list.map((c) => ({ id: c.slug, label: c.name.toUpperCase() })),
        ]);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    getProducts({
      category: activeCategory === "all" ? undefined : activeCategory,
    })
      .then(({ products: list }) => setProducts(list.map(mapProduct)))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  const filteredProducts = useMemo(() => products, [products]);

  const handleAddToCart = async (product: Product, variantId?: string) => {
    const id = variantId ?? product.defaultVariantId;
    if (!id) return;
    try {
      await addCartItem(id, 1);
      await refreshCart();
    } catch {
      // show error optionally
    }
  };

  return (
    <div className="relative pt-8 pb-20 flex-grow">
      <div className="max-w-7xl mx-auto px-6 mb-8 text-center relative z-10">
        <h1 className="text-5xl md:text-7xl text-text-chocolate brand-font mb-4">
          THE STASH
        </h1>
        <p className="text-xl font-bold product-font text-text-chocolate max-w-2xl mx-auto">
          Grab your favorites before the internet eats them all.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 mb-12 relative z-10">
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </div>

      {loading ? (
        <div className="max-w-7xl mx-auto px-6 flex justify-center py-12">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">
            progress_activity
          </span>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8 items-stretch relative z-10">
          {filteredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              hoverRotate={index % 2 === 0 ? 1 : -1}
            />
          ))}
        </div>
      )}
      {!loading && filteredProducts.length === 0 && (
        <p className="max-w-7xl mx-auto px-6 text-center text-text-chocolate/80 font-bold py-12">
          No products in this category yet.
        </p>
      )}
    </div>
  );
}
