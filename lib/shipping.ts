/**
 * Standard delivery (deliver to my address) – tiered by cart subtotal.
 * Subtotal is in paise; thresholds and charges:
 *
 * | Cart subtotal  | Shipping charge |
 * |----------------|-----------------|
 * | Below ₹200     | ₹50             |
 * | ₹200 – ₹498    | ₹100            |
 * | ₹499 and above | Free            |
 */
export const STANDARD_SHIPPING = {
  /** Below this (paise): charge ₹50 */
  BELOW_200_PAISE: 20_000,
  /** ₹50 in paise */
  CHARGE_50_PAISE: 5_000,
  /** From ₹200 up to below this (paise): charge ₹100 */
  BELOW_FREE_PAISE: 49_900,
  /** ₹100 in paise */
  CHARGE_100_PAISE: 10_000,
} as const;

/**
 * Returns standard delivery shipping amount in paise for the given cart subtotal (paise).
 * For campus delivery, callers use 0; this is for "deliver to my address" only.
 */
export function getStandardShippingPaise(subtotalPaise: number): number {
  if (subtotalPaise >= STANDARD_SHIPPING.BELOW_FREE_PAISE) return 0;
  if (subtotalPaise < STANDARD_SHIPPING.BELOW_200_PAISE)
    return STANDARD_SHIPPING.CHARGE_50_PAISE;
  return STANDARD_SHIPPING.CHARGE_100_PAISE;
}
