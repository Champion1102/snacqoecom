"use client";
const TOP_TEXT =
  "★ NOT YOUR AVERAGE NUT ★ BOLD AF FLAVORS ★ SNACK DIFFERENT ★ NO BORING HEALTH FOOD ★ ";
const MIDDLE_TEXT =
  "★ REAL INGREDIENTS ★ NO FAKE STUFF ★ HIGH PROTEIN ★ LOW GUILT ★ ";

type Variant = 'top' | 'middle';

export function Marquee({ variant }: { variant: Variant }) {
  const isTop = variant === 'top';
  return (
    <div
      className={
        isTop
          ? 'bg-text-chocolate py-2 overflow-hidden whitespace-nowrap relative z-50 border-b-2 border-white no-scrollbar'
          : 'bg-accent-strawberry py-3 overflow-hidden whitespace-nowrap border-y-4 border-text-chocolate -rotate-1 shadow-lg relative z-20 mb-12 no-scrollbar'
      }
    >
      <div className="inline-block animate-marquee">
        <span
          className={
            isTop
              ? 'text-accent-mango font-black text-sm md:text-base px-4 uppercase tracking-wider font-display'
              : 'text-white font-black text-2xl md:text-3xl px-4 uppercase tracking-wider font-display'
          }
          style={!isTop ? { textShadow: '2px 2px 0px #2D1B0E' } : undefined}
        >
          {isTop ? TOP_TEXT.repeat(2) : MIDDLE_TEXT.repeat(2)}
        </span>
        <span
          className={
            isTop
              ? 'text-accent-mango font-black text-sm md:text-base px-4 uppercase tracking-wider font-display'
              : 'text-white font-black text-2xl md:text-3xl px-4 uppercase tracking-wider font-display'
          }
          style={!isTop ? { textShadow: '2px 2px 0px #2D1B0E' } : undefined}
          aria-hidden
        >
          {isTop ? TOP_TEXT.repeat(2) : MIDDLE_TEXT.repeat(2)}
        </span>
      </div>
    </div>
  );
}
