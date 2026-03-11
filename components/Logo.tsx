"use client";
import { motion } from 'framer-motion';

type LogoProps = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const sizes = {
  sm: { snac: 'text-xl', qo: 'text-3xl', mt: '-mt-1' },
  md: { snac: 'text-2xl', qo: 'text-4xl', mt: '-mt-1' },
  lg: { snac: 'text-7xl md:text-8xl', qo: 'text-8xl md:text-9xl', mt: '-mt-4 md:-mt-6' },
};

export function Logo({ size = 'sm', className = '' }: LogoProps) {
  const s = sizes[size];
  return (
    <motion.div
      className={`snacqo-logo flex flex-col items-center justify-center brand-font font-black text-primary tracking-tight ${className}`}
      style={{ textShadow: size === 'lg' ? '6px 6px 0px #2D1B0E' : '2px 2px 0px #2D1B0E' }}
      whileHover={{ rotate: 6 }}
      transition={{ duration: 0.3 }}
    >
      <span className={`block ${s.snac} -mt-0`} style={{ textShadow: size === 'lg' ? '4px 4px 0px #2D1B0E' : '2px 2px 0px #2D1B0E' }}>
        snac
      </span>
      <span className={`block ${s.qo} ${s.mt} relative inline-block`} style={{ textShadow: size === 'lg' ? '6px 6px 0px #2D1B0E' : '2px 2px 0px #2D1B0E' }}>
        QO<span className="text-[0.28em] font-black text-primary align-super leading-none" style={{ textShadow: 'none', verticalAlign: 'super', fontSize: '0.28em' }}>™</span>
      </span>
    </motion.div>
  );
}
