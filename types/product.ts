export interface ProductVariantOption {
  id: string;
  label: string;
  price: string;
  outOfStock: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: string;
  description: string;
  icon: string;
  /** Tailwind background class for icon area, e.g. bg-[#FFEBEE] */
  iconBgColor: string;
  /** Tailwind text color for icon, e.g. text-primary */
  iconColor?: string;
  /** Card label shown on product card (e.g. Bestseller, Hot). Set from admin. */
  tapeLabel?: string;
  category: string;
  /** First variant id for add-to-cart */
  defaultVariantId?: string;
  /** True when default variant is out of stock (stock === 0 or outOfStock) */
  outOfStock?: boolean;
  /** Variants for size/option buttons on card (e.g. 50G, 100G) */
  variants?: ProductVariantOption[];
  /** First product image URL for card; if missing, icon is shown */
  imageUrl?: string;
}
