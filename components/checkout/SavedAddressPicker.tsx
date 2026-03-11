"use client";
import type { AddressResponse } from '@/api/addresses';

interface SavedAddressPickerProps {
  addresses: AddressResponse[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onUseSelected: () => void;
  onAddNew: () => void;
  isSubmitting?: boolean;
}

export function SavedAddressPicker({
  addresses,
  selectedId,
  onSelect,
  onUseSelected,
  onAddNew,
  isSubmitting,
}: SavedAddressPickerProps) {
  return (
    <div className="bg-white p-6 md:p-8 border-4 border-text-chocolate shadow-[8px_8px_0px_0px_#2D1B0E] relative">
      <div className="absolute -top-3 right-10 w-24 h-6 tape-strip rotate-2" aria-hidden />

      <p className="text-xs font-black uppercase tracking-widest text-text-chocolate/60 mb-4">
        Saved Addresses
      </p>

      <div className="flex flex-col gap-4 mb-6">
        {addresses.map((addr) => {
          const isSelected = addr.id === selectedId;
          return (
            <button
              key={addr.id}
              type="button"
              onClick={() => onSelect(addr.id)}
              className={`w-full text-left p-4 border-2 transition-all relative ${
                isSelected
                  ? 'border-primary bg-primary/5 shadow-[4px_4px_0px_0px_#FF6B6B]'
                  : 'border-text-chocolate bg-background-light hover:border-primary hover:bg-primary/5'
              }`}
            >
              {/* selection dot */}
              <span
                className={`absolute top-4 right-4 w-4 h-4 rounded-full border-2 border-text-chocolate flex items-center justify-center ${
                  isSelected ? 'bg-primary border-primary' : 'bg-white'
                }`}
              >
                {isSelected && <span className="w-2 h-2 rounded-full bg-white block" />}
              </span>

              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-black uppercase tracking-wider bg-secondary px-2 py-0.5 border border-text-chocolate">
                  {addr.label}
                </span>
                {addr.isDefault && (
                  <span className="text-xs font-bold text-primary uppercase tracking-wide">
                    Default
                  </span>
                )}
              </div>
              <p className="font-bold text-text-chocolate">{addr.name}</p>
              <p className="text-sm text-text-chocolate/70 font-medium leading-snug mt-0.5">
                {addr.line1}
                {addr.line2 ? `, ${addr.line2}` : ''}, {addr.city}, {addr.state} – {addr.pincode}
              </p>
              <p className="text-sm text-text-chocolate/60 font-medium mt-0.5">{addr.phone}</p>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between pt-6 border-t-2 border-dashed border-text-chocolate/30">
        <button
          type="button"
          onClick={onAddNew}
          className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-text-chocolate hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-base">add_circle</span>
          Use a different address
        </button>

        <button
          type="button"
          onClick={onUseSelected}
          disabled={!selectedId || isSubmitting}
          className="w-full md:w-auto bg-accent-mango px-10 py-4 text-text-chocolate text-xl border-2 border-text-chocolate shadow-[4px_4px_0px_0px_#2D1B0E] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#2D1B0E] transition-all font-black uppercase tracking-wide btn-text disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Placing order…' : 'Continue to Payment'}
        </button>
      </div>
    </div>
  );
}
