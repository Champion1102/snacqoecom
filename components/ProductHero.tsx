"use client";
import { useState } from 'react';
import type { ProductDetail } from '@/types/productDetail';

interface ProductHeroProps {
  product: ProductDetail;
}

export function ProductHero({ product }: ProductHeroProps) {
  const images = product.images && product.images.length > 0 ? product.images : null;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const mainImageUrl = images ? images[selectedIndex]?.url ?? product.imageUrl : product.imageUrl;

  return (
    <div className="relative order-1">
      <div className="lg:sticky lg:top-32">
        <div className="relative w-full aspect-square sm:aspect-[4/5] max-w-[300px] sm:max-w-lg mx-auto transform -rotate-1 hover:rotate-0 transition-transform duration-500">
          <div className="absolute inset-0 bg-white p-3 sm:p-4 border-4 border-text-chocolate shadow-polaroid z-10 transition-transform duration-300">
            <div className="w-full h-full bg-[#FFF8E1] border-2 border-text-chocolate overflow-hidden relative flex items-center justify-center aspect-square sm:aspect-[4/5]">
              <img
                alt={product.name}
                className="w-full h-full object-cover drop-shadow-xl hover:scale-105 transition-transform duration-300"
                src={mainImageUrl}
              />
              {product.badge && (
                <div
                  className="absolute top-3 right-3 bg-accent-strawberry text-white text-xs px-2 py-1 rotate-12 btn-text border border-text-chocolate shadow-chunky-sm z-20"
                  aria-hidden
                >
                  {product.badge}
                </div>
              )}
            </div>
            <div
              className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 sm:w-32 h-7 sm:h-8 tape-strip z-20"
              aria-hidden
            />
          </div>
        </div>
        {images && images.length > 0 ? (
          <div className="flex gap-2 sm:gap-3 justify-center mt-5 sm:mt-8 max-w-[300px] sm:max-w-lg mx-auto flex-wrap">
            {images.map((img, i) => (
              <button
                key={img.id}
                type="button"
                onClick={() => setSelectedIndex(i)}
                className={`w-14 h-14 sm:w-20 sm:h-20 flex-shrink-0 bg-white border-2 border-text-chocolate p-1 cursor-pointer hover:-translate-y-0.5 transition-transform shadow-chunky-sm overflow-hidden ${
                  selectedIndex === i ? 'ring-2 ring-text-chocolate ring-offset-2 ring-offset-[#FFF8E1]' : ''
                }`}
                aria-label={`View image ${i + 1}`}
              >
                <img
                  src={img.url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        ) : (
          <div className="flex gap-3 sm:gap-4 justify-center mt-6 sm:mt-12 max-w-[300px] sm:max-w-lg mx-auto">
            {['bg-accent-mango/20', 'bg-primary/20', 'bg-secondary/20'].map((swatch) => (
              <button
                key={swatch}
                type="button"
                className="w-14 h-14 sm:w-20 sm:h-20 bg-white border-2 border-text-chocolate p-1 flex-shrink-0 cursor-default shadow-chunky-sm"
                aria-hidden
              >
                <div className={`w-full h-full ${swatch}`} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
