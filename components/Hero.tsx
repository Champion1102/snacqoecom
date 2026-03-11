"use client";
import Link from 'next/link'
import { motion } from 'framer-motion';
import { Logo } from './Logo';
import { homepageImages } from '@/config/homepage-images';

export function Hero() {
  return (
    <section className="relative w-full px-6 py-12 md:py-20 lg:py-24 overflow-hidden" id="about">
      {/* Blobs */}
      <motion.div
        className="absolute top-20 right-0 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-70"
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -50, 20, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-40 left-20 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70"
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -50, 20, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
      <motion.div
        className="absolute -bottom-32 left-1/3 w-96 h-96 bg-accent-mango/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70"
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -50, 20, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
      />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        <div className="flex flex-col gap-6 md:gap-8 order-2 lg:order-1 text-center lg:text-left relative min-w-0">
          <div className="absolute -top-12 left-20 hidden lg:block -rotate-12">
            <span className="hand-font text-text-chocolate text-lg rotate-6 block mb-1">
              It's pronounced "snack-o"
            </span>
            <svg
              className="text-text-chocolate ml-8"
              fill="none"
              height={60}
              stroke="currentColor"
              strokeWidth={3}
              viewBox="0 0 100 100"
              width={60}
            >
              <path d="M10 10 Q 50 50 80 80 M 80 80 L 60 85 M 80 80 L 85 60" />
            </svg>
          </div>

          <motion.div
            className="mx-auto lg:mx-0 w-fit mb-2"
            initial={{ rotate: -6 }}
            whileHover={{ rotate: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Logo size="lg" className="scale-110 origin-bottom-left" />
          </motion.div>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-text-chocolate shadow-sticker-sm mx-auto lg:mx-0 w-fit -rotate-2">
            <span className="w-3 h-3 rounded-full bg-accent-strawberry animate-ping" />
            <span className="text-xs font-black uppercase tracking-widest text-text-chocolate">
              Now Shipping Nationwide
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl xl:text-8xl font-black leading-[0.85] tracking-tighter text-text-chocolate font-product mt-2 relative">
            Snacks that <br />
            <span className="text-accent-strawberry relative inline-block">
              hit different.
              <svg
                className="absolute w-[110%] h-6 -bottom-2 -left-2 text-accent-mango fill-current z-[-1] -rotate-1"
                viewBox="0 0 200 9"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.00025 6.99997C2.00025 6.99997 32.653 1.00018 97.466 1.00018C162.279 1.00018 198.001 7.49997 198.001 7.49997"
                  stroke="#FF9F1C"
                  strokeLinecap="round"
                  strokeWidth={6}
                />
              </svg>
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-text-chocolate font-bold max-w-lg mx-auto lg:mx-0 leading-tight">
            Premium almonds & cashews. <span className="bg-accent-mango/30 px-1">Wild coatings.</span>{' '}
            <br /> No boring health food allowed.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6 mt-6 justify-center lg:justify-start">
            <Link
              href="/shop"
              className="w-full sm:w-auto block sm:inline-block text-center"
            >
              <motion.span
                className="inline-block w-full px-10 py-5 bg-primary text-white font-black text-xl border-4 border-text-chocolate shadow-sticker hover:shadow-sticker-sm transition-all transform skew-x-[-5deg] text-center"
                whileHover={{
                  x: 2,
                  y: 2,
                  boxShadow: '2px 2px 0px 0px #2D1B0E',
                  rotate: -1,
                }}
                whileTap={{ scale: 0.98 }}
              >
                Shop all snacks
              </motion.span>
            </Link>
            <motion.a
              href="#flavors"
              className="w-full sm:w-auto px-8 py-5 bg-white text-text-chocolate font-black text-lg border-4 border-text-chocolate shadow-[6px_6px_0px_0px_#E0F7FA] flex items-center justify-center gap-2 transform rotate-1"
              whileHover={{
                x: 2,
                y: 2,
                boxShadow: '2px 2px 0px 0px #E0F7FA',
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span>SEE FLAVORS</span>
              <span className="material-symbols-outlined text-xl font-bold">arrow_downward</span>
            </motion.a>
          </div>
        </div>

        <div className="order-1 lg:order-2 relative h-[450px] md:h-[650px] w-full flex items-center justify-center">
          <div className="relative w-full h-full max-w-md mx-auto">
            <motion.div
              className="absolute inset-0 bg-white p-4 pb-16 border-4 border-text-chocolate z-10"
              style={{
                boxShadow: '12px 12px 0px 0px rgba(45,27,14,0.2)',
                rotate: 3,
              }}
              whileHover={{ rotate: 6, scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-full h-full bg-secondary border-2 border-text-chocolate overflow-hidden relative">
                <img
                  alt="Close up of premium roasted almonds in a bowl"
                  className="w-full h-full object-cover grayscale-[0.2] contrast-125 hover:grayscale-0 transition-all duration-500"
                  src={homepageImages.heroAlmonds}
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-accent-mango/20 to-transparent mix-blend-overlay pointer-events-none" />
              </div>
              <div className="absolute bottom-4 left-0 w-full text-center">
                <span className="hand-font text-2xl text-text-chocolate rotate-[-2deg] inline-block">
                  Mood: Craving 😋
                </span>
              </div>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 tape-strip z-20" />
            </motion.div>

            <motion.div
              className="absolute -top-8 -right-4 w-36 h-36 bg-accent-mango rounded-full border-4 border-text-chocolate flex items-center justify-center z-20 shadow-sticker rotate-12"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="text-center transform -rotate-12">
                <span className="block text-4xl font-black text-text-chocolate leading-none brand-font">
                  100%
                </span>
                <span className="block text-sm font-black text-text-chocolate uppercase tracking-widest">
                  Addictive
                </span>
              </div>
            </motion.div>

            <div className="absolute -bottom-12 -left-8 bg-white p-4 border-4 border-text-chocolate shadow-sticker z-20 -rotate-6 max-w-[220px]">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-3 py-1 text-xs font-black uppercase border-2 border-text-chocolate -rotate-2">
                Pro Tip
              </div>
              <p className="mt-2 text-base hand-font leading-tight text-text-chocolate text-center">
                &quot;Pair with your 3pm iced coffee for max vibes&quot;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
