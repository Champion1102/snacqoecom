"use client";
import { useEffect, useMemo } from 'react';
import { type MotionValue, useMotionValue, useSpring, useTransform, motion } from 'framer-motion';

const TRAIL_COUNT = 12;
const SIZE = 28;
const SPRING_BASE = { stiffness: 80, damping: 22 };

const TRAIL_IMAGES: string[] = [
  '/cashew.svg',
  '/almond.png',
  '/cashew.svg',
  '/almond.png',
  '/cashew.svg',
  '/almond.png',
  '/cashew.svg',
  '/almond.png',
  '/cashew.svg',
  '/almond.png',
  '/cashew.svg',
  '/almond.png',
];

// Stagger stiffness so later items trail more (lower stiffness = more lag)
function useTrailingPosition(mouseX: MotionValue<number>, mouseY: MotionValue<number>, index: number) {
  const stiffness = Math.max(20, SPRING_BASE.stiffness - index * 6);
  const springX = useSpring(mouseX, { stiffness, damping: SPRING_BASE.damping });
  const springY = useSpring(mouseY, { stiffness, damping: SPRING_BASE.damping });
  const offsetX = useMemo(() => (index - TRAIL_COUNT / 2) * 8 + (index % 3) * 4, [index]);
  const offsetY = useMemo(() => (index % 2 === 0 ? 12 : -8) + index * 3, [index]);
  const x = useTransform(springX, (v) => v + offsetX - SIZE / 2);
  const y = useTransform(springY, (v) => v + offsetY - SIZE / 2);
  return { x, y };
}

export function CursorCashews() {
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      {Array.from({ length: TRAIL_COUNT }, (_, i) => (
        <CursorTrailItem
          key={i}
          index={i}
          mouseX={mouseX}
          mouseY={mouseY}
          src={TRAIL_IMAGES[i % TRAIL_IMAGES.length]}
        />
      ))}
    </div>
  );
}

function CursorTrailItem({
  index,
  mouseX,
  mouseY,
  src,
}: {
  index: number;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  src: string;
}) {
  const { x, y } = useTrailingPosition(mouseX, mouseY, index);
  const scale = 0.5 + (index / TRAIL_COUNT) * 0.5;
  const opacity = 0.5 + (index / TRAIL_COUNT) * 0.45;
  const rotate = index * 25;

  return (
    <motion.div
      className="absolute left-0 top-0 will-change-transform"
      style={{ x, y, width: SIZE, height: SIZE, scale, opacity, rotate }}
    >
      <img
        src={src}
        alt=""
        className="w-full h-full object-contain select-none"
        draggable={false}
      />
    </motion.div>
  );
}
