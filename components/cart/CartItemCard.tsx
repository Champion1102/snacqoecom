"use client";
import type { CartItem } from '@/types/cart';

interface CartItemCardProps {
  item: CartItem;
  onQuantityChange: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}

export function CartItemCard({ item, onQuantityChange, onRemove }: CartItemCardProps) {
  return (
    <div className="bg-white rounded-xl border-4 border-text-chocolate p-3 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-6 relative shadow-[4px_4px_0px_0px_#2D1B0E]">
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center rounded-full text-text-chocolate/60 hover:text-accent-strawberry hover:bg-slate-100 transition-colors"
        aria-label={`Remove ${item.name}`}
      >
        <span className="material-symbols-outlined text-xl">close</span>
      </button>

      {/* Mobile: image left, details + qty right */}
      <div className="flex gap-3 flex-1 min-w-0">
        <div
          className={`w-20 h-20 sm:w-32 sm:h-32 rounded-lg border-2 border-text-chocolate flex-shrink-0 overflow-hidden bg-secondary`}
        >
          {item.imageUrl ? (
            <img
              alt={item.name}
              className="w-full h-full object-cover"
              src={item.imageUrl}
            />
          ) : item.icon ? (
            <div className="w-full h-full flex items-center justify-center">
              <span
                className="material-symbols-outlined text-4xl sm:text-6xl text-primary"
                style={{ fontVariationSettings: "'FILL' 1" }}
                aria-hidden
              >
                {item.icon}
              </span>
            </div>
          ) : null}
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-between pr-8">
          <div>
            <h3 className="product-font font-bold text-sm sm:text-2xl text-text-chocolate leading-tight line-clamp-2">
              {item.name}
            </h3>
            {item.variant && (
              <p className="text-xs sm:text-sm text-text-chocolate/70 font-medium mt-0.5 uppercase">
                {item.variant}
              </p>
            )}
            <p className="product-font font-bold text-base sm:text-2xl text-text-chocolate mt-1">
              {item.price}
            </p>
          </div>

          {/* Quantity selector: same on mobile and desktop */}
          <div className="flex items-center border-2 border-text-chocolate bg-white rounded mt-2 self-start sm:mt-0">
            <button
              type="button"
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-gray-100 text-lg font-bold text-text-chocolate disabled:opacity-50"
              onClick={() => onQuantityChange(item.id, -1)}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-8 sm:w-12 text-center product-font font-bold text-sm sm:text-lg border-x-2 border-text-chocolate">
              {item.quantity}
            </span>
            <button
              type="button"
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-gray-100 text-lg font-bold text-text-chocolate disabled:opacity-50"
              onClick={() => onQuantityChange(item.id, 1)}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
