"use client";
import type { SavedAddress } from '@/types/account';

interface AddressCardProps {
  address: SavedAddress;
  shadowColor: 'secondary' | 'text-chocolate' | 'accent-strawberry';
  rotation?: 'none' | 'right' | 'left';
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const SHADOW_CLASS = {
  secondary: 'bg-secondary border-2 border-text-chocolate',
  'text-chocolate': 'bg-text-chocolate',
  'accent-strawberry': 'bg-accent-strawberry border-2 border-text-chocolate',
};

export function AddressCard({
  address,
  shadowColor,
  rotation = 'none',
  onEdit,
  onDelete,
}: AddressCardProps) {
  const rotationClass =
    rotation === 'right' ? 'md:rotate-1 hover:rotate-0' : rotation === 'left' ? 'md:rotate-[-1deg] hover:rotate-0' : '';

  return (
    <div className={`group relative hover:z-20 transition-all duration-300 ${rotationClass}`}>
      <div
        className={`absolute inset-0 translate-y-3 translate-x-3 w-full h-full ${SHADOW_CLASS[shadowColor]}`}
        aria-hidden
      />
      <div className="relative bg-white border-4 border-text-chocolate p-6 h-full flex flex-col transition-transform duration-300 hover:-translate-y-1 hover:-translate-x-1">
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 tape-strip rotate-2"
          aria-hidden
        />
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col">
            <h3 className="text-2xl text-text-chocolate brand-font leading-none">
              {address.label}
            </h3>
            <span className="text-sm font-bold text-text-chocolate/60 mt-1">
              {address.recipientName}
            </span>
          </div>
          {address.isDefault && (
            <span className="bg-secondary text-text-chocolate text-xs px-3 py-1 border-2 border-text-chocolate shadow-[2px_2px_0px_0px_#2D1B0E] -rotate-3 btn-text">
              DEFAULT
            </span>
          )}
        </div>
        <div className="mb-8 font-medium text-text-chocolate leading-relaxed">
          <p>{address.line1}</p>
          {address.line2 && <p>{address.line2}</p>}
          <p>
            {address.city}, {address.state} {address.zip}
          </p>
          <p className="mt-2 text-sm text-text-chocolate/70">📞 {address.phone}</p>
        </div>
        <div className="mt-auto flex gap-3 pt-4 border-t-2 border-dashed border-text-chocolate/20">
          <button
            type="button"
            onClick={() => onEdit(address.id)}
            className="flex-1 py-2 px-3 bg-white border-2 border-text-chocolate text-sm hover:bg-accent-mango hover:text-white transition-colors shadow-[2px_2px_0px_0px_#2D1B0E] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none btn-text uppercase"
          >
            Edit
          </button>
          {address.isDefault ? (
            <button
              type="button"
              disabled
              className="py-2 px-3 bg-gray-100 border-2 border-gray-300 text-gray-400 text-sm cursor-not-allowed btn-text uppercase"
              title="Cannot remove default address"
            >
              <span className="material-symbols-outlined text-base">delete</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onDelete(address.id)}
              className="py-2 px-3 bg-white border-2 border-text-chocolate text-accent-strawberry text-sm hover:bg-accent-strawberry hover:text-white transition-colors shadow-[2px_2px_0px_0px_#2D1B0E] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none btn-text uppercase"
            >
              <span className="material-symbols-outlined text-base">delete</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
