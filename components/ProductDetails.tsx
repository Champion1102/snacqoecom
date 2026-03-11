"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ProductAccordion } from '@/components/ProductAccordion';
import { StarIcon } from '@/components/StarIcon';
import type { ProductDetail, ProductSizeOption } from '@/types/productDetail';

interface ProductDetailsProps {
  product: ProductDetail;
  onAddToCart?: (product: ProductDetail, sizeId: string, quantity: number) => void;
}

const FEATURES = [
  { icon: 'eco', bg: 'bg-secondary', label: '100% Real' },
  { icon: 'bolt', bg: 'bg-primary/20', label: 'Energy Hit' },
  { icon: 'sentiment_very_satisfied', bg: 'bg-accent-mango/30', label: 'No Guilt' },
];

function StarRating({ rating }: { rating: number }) {
  const stars = Math.min(5, Math.max(0, Math.round(rating)));
  return (
    <div className="flex text-accent-mango gap-0.5" aria-label={`${rating} stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <StarIcon key={i} filled={i <= stars} className="w-4 h-4" />
      ))}
    </div>
  );
}

export function ProductDetails({ product, onAddToCart }: ProductDetailsProps) {
  const [selectedSizeId, setSelectedSizeId] = useState<string>(product.sizes[0]?.id ?? '');
  const [quantity, setQuantity] = useState(1);
  const selectedSize = product.sizes.find((s) => s.id === selectedSizeId);
  const isOutOfStock = selectedSize?.outOfStock === true;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    onAddToCart?.(product, selectedSizeId, quantity);
  };

  return (
    <div className="flex flex-col gap-6 order-2 relative">
      <div className="relative">
        <div className="flex items-center gap-3 mb-2">
          <span className="bg-text-chocolate text-white px-3 py-1 text-xs font-bold uppercase tracking-widest border border-text-chocolate transform -rotate-1">
            {product.category}
          </span>
          <div className="flex items-center gap-1">
            <StarRating rating={product.rating} />
            <span className="text-text-chocolate text-xs font-bold ml-1 mt-0.5">
              ({product.reviewCount} Reviews)
            </span>
          </div>
        </div>
        <h1 className="product-font font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-text-chocolate leading-[0.9] mb-4 uppercase tracking-wide">
          {product.titlePart1} <br />
          <span className="text-accent-mango">{product.titlePart2}</span>
        </h1>
        <p className="text-sm sm:text-base md:text-lg font-medium text-text-chocolate/80 leading-relaxed max-w-md">
          {product.description}
        </p>
        <div className="flex items-end gap-3 mt-4">
          <span className="text-xl sm:text-2xl md:text-3xl font-black text-text-chocolate product-font">
            {selectedSize?.price ?? product.price}
          </span>
          {(selectedSize?.compareAtPrice ?? product.compareAtPrice) && (
            <span className="text-sm sm:text-base md:text-lg text-text-chocolate/50 line-through font-bold decoration-2 mb-1">
              {selectedSize?.compareAtPrice ?? product.compareAtPrice}
            </span>
          )}
        </div>
      </div>

      <hr className="border-text-chocolate/20 border-dashed border-2 my-2" />

      <div className="space-y-6">
        <div>
          <label className="block btn-text text-sm uppercase text-text-chocolate mb-3">
            Size it up:
          </label>
          <div className="flex flex-wrap gap-3 sm:gap-4">
            {product.sizes.map((size: ProductSizeOption) => {
              const isSelected = selectedSizeId === size.id;
              const outOfStock = size.outOfStock === true;
              return (
                <button
                  key={size.id}
                  type="button"
                  onClick={() => !outOfStock && setSelectedSizeId(size.id)}
                  disabled={outOfStock}
                  className={`flex-1 py-2.5 px-3 border-2 border-text-chocolate font-bold text-center product-font uppercase text-sm sm:text-base transition-all ${
                    outOfStock
                      ? 'bg-gray-100 text-text-chocolate/50 cursor-not-allowed opacity-70'
                      : isSelected
                        ? 'bg-accent-mango text-text-chocolate shadow-chunky -translate-y-1 shadow-chunky-lg ring-2 ring-text-chocolate ring-offset-2 ring-offset-[#FFFEF5]'
                        : 'bg-white text-text-chocolate shadow-chunky hover:bg-secondary hover:-translate-y-1 hover:shadow-chunky-lg'
                  }`}
                >
                  {size.label}{' '}
                  <span className="block text-xs font-normal mt-1 opacity-70">
                    {outOfStock ? 'Out of stock' : size.sublabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex flex-row gap-3 pt-1">
          <div className="flex items-center bg-white border-2 border-text-chocolate shadow-chunky h-[52px] sm:h-16 w-[120px] sm:w-[140px] flex-shrink-0">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-10 sm:w-12 h-full flex items-center justify-center hover:bg-gray-100 border-r-2 border-text-chocolate transition-colors"
              aria-label="Decrease quantity"
            >
              <span className="material-symbols-outlined text-base font-bold">remove</span>
            </button>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="w-full h-full text-center text-base sm:text-xl font-bold border-none focus:ring-0 p-0 text-text-chocolate bg-transparent product-font"
              aria-label="Quantity"
            />
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="w-10 sm:w-12 h-full flex items-center justify-center hover:bg-gray-100 border-l-2 border-text-chocolate transition-colors"
              aria-label="Increase quantity"
            >
              <span className="material-symbols-outlined text-base font-bold">add</span>
            </button>
          </div>
          {isOutOfStock ? (
            <div className="flex-1 h-[52px] sm:h-16 bg-text-chocolate/20 text-text-chocolate/70 border-2 border-text-chocolate/40 flex items-center justify-center gap-2 text-sm sm:text-lg btn-text uppercase tracking-wider cursor-not-allowed">
              <span>Out of stock</span>
            </div>
          ) : (
            <motion.button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 h-[52px] sm:h-16 bg-accent-mango text-text-chocolate border-2 border-text-chocolate shadow-chunky-lg hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-chunky hover:-rotate-1 transition-all flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-lg btn-text uppercase tracking-wide group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Add To Cart</span>
              <span className="material-symbols-outlined text-base sm:text-xl group-hover:animate-bounce">
                shopping_cart
              </span>
            </motion.button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4 text-center">
        {FEATURES.map(({ icon, bg, label }) => (
          <div key={label} className="flex flex-col items-center gap-1">
            <div
              className={`w-10 h-10 rounded-full ${bg} border-2 border-text-chocolate flex items-center justify-center`}
            >
              <span className="material-symbols-outlined text-lg">{icon}</span>
            </div>
            <span className="text-xs font-bold uppercase">{label}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-4">
        {product.descriptionContent && (
          <ProductAccordion title="Description">
            <p>{product.descriptionContent}</p>
          </ProductAccordion>
        )}
        <ProductAccordion title="Ingredients & Nutrition">
          {product.ingredients || (product.nutrition && product.nutrition.length > 0) ? (
            <>
              {product.ingredients && (
                <>
                  <p className="mb-2 font-bold text-sm">Ingredients:</p>
                  <p className="text-sm mb-4">{product.ingredients}</p>
                </>
              )}
              {product.nutrition && product.nutrition.length > 0 && (
                <>
                  <p className="mb-2 font-bold text-sm">Nutrition (per 30g):</p>
                  <ul className="text-sm list-disc pl-4 space-y-1">
                    {product.nutrition.map(({ label, value }) => (
                      <li key={label}>
                        {label}: {value}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </>
          ) : (
            <p className="text-sm text-text-chocolate/60">No ingredients or nutrition information available.</p>
          )}
        </ProductAccordion>
      </div>
    </div>
  );
}
