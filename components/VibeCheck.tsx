"use client";
import { motion } from 'framer-motion';
import { homepageImages } from '@/config/homepage-images';

export function VibeCheck() {
  return (
    <section
      className="py-24 px-6 bg-background-light relative overflow-hidden"
      id="vibe"
    >
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "url('https://www.transparenttextures.com/patterns/cubes.png')",
        }}
      />
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header: POV motto + main title + tag line */}
        <div className="relative mb-14 md:mb-18">
          <p className="hand-font text-xl md:text-2xl mb-8 md:mb-6 md:pl-6 rotate-[-2deg] text-[#FF6B6B]">
            POV: YOU FOUND YOUR NEW OBSESSION ✨
          </p>
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-black text-text-chocolate inline-block bg-accent-mango px-5 py-2 border-4 border-text-chocolate shadow-sticker-sm transform rotate-[-1deg] brand-font">
              THE VIBE CHECK
            </h2>
            <p className="text-lg font-bold mt-4 rotate-1 text-text-chocolate">
              📸 Tag us @snacQO to get featured
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[280px]">
          {/* Left: User testimonial with photo + TASTE TEST APPROVED + Instagram bubble */}
          <motion.div
            className="md:col-span-2 md:row-span-2 relative group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 bg-text-chocolate translate-x-2 translate-y-2 rotate-[3deg]" />
            <div className="relative h-full min-h-[300px] bg-white p-2 border-4 border-text-chocolate rotate-[2deg] group-hover:rotate-0 transition-transform duration-300 overflow-hidden">
              <div className="absolute -top-1 left-4 w-24 h-6 tape-strip z-20 rotate-[-15deg]" />
              <div className="absolute top-2 left-2 z-20 bg-[#FEF08A] border-2 border-text-chocolate px-3 py-1.5 shadow-sticker-sm rotate-[-6deg]">
                <span className="text-green-600 font-black text-sm">✔</span>{' '}
                <span className="font-black text-text-chocolate text-xs uppercase tracking-tight">
                  TASTE TEST APPROVED
                </span>
              </div>
              <img
                alt="Vibe check - taste test approved"
                className="w-full h-full object-cover object-top grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500 border-2 border-text-chocolate/30"
                src={homepageImages.vibeCheck}
              />
              <div className="absolute bottom-6 left-4 right-4 md:right-8 bg-white border-2 border-text-chocolate p-4 rotate-[-2deg] shadow-sticker-sm max-w-sm">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-xs font-bold uppercase text-gray-500">
                    Instagram Stories
                  </span>
                </div>
                <p className="font-bold text-text-chocolate text-base leading-tight">
                  &quot;Literally can&apos;t stop eating these help 💀💀&quot;
                </p>
              </div>
            </div>
          </motion.div>

          {/* Crave-O-Meter circle — light blue circle, thick coral shadow, 3D text */}
          <motion.div
            className="relative group flex items-center justify-center min-h-[260px]"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="relative w-[220px] h-[220px] md:w-[240px] md:h-[240px]">
              {/* Thick coral-pink shadow: same-size circle, substantial offset bottom-right */}
              <div
                className="absolute top-0 left-0 w-full h-full rounded-full"
                style={{
                  backgroundColor: '#FF6B6B',
                  transform: 'translate(14px, 14px) rotate(-3deg)',
                }}
              />
              <div className="absolute inset-0 rounded-full bg-secondary border-4 border-text-chocolate flex flex-col justify-center items-center text-center p-4 md:p-5 rotate-[-2deg] group-hover:rotate-0 transition-transform group-hover:scale-105">
                <span className="hand-font text-text-chocolate text-sm md:text-base uppercase tracking-wide">
                  Crave-O-Meter
                </span>
                <span
                  className="text-xl md:text-2xl font-black text-primary brand-font leading-tight mt-1 text-center"
                  style={{
                    textShadow:
                      '0 0 2px rgba(255,255,255,0.9), 0 0 1px white, 3px 3px 0 #E05A5A',
                  }}
                >
                  INSTANT OBSESSION
                </span>
                <div
                  className="mt-2 bg-white border-2 border-text-chocolate px-3 py-1"
                  style={{ boxShadow: '2px 2px 0px 0px #2D1B0E' }}
                >
                  <span className="font-black text-text-chocolate text-xs uppercase">
                    100% VERIFIED
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Spices / ingredients frame with #SPICY, #tangy, #sweet */}
          <motion.div
            className="relative group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 bg-text-chocolate translate-x-2 translate-y-2 rotate-[4deg]" />
            <div className="relative h-full min-h-[200px] bg-white p-2 border-4 border-text-chocolate rotate-[3deg] group-hover:rotate-0 transition-transform duration-300 overflow-hidden">
              <div className="absolute -top-1 right-8 w-16 h-5 tape-strip z-20 rotate-[25deg]" />
              <img
                alt="Top down view of colorful spices and ingredients"
                className="w-full h-full object-cover border-2 border-text-chocolate/30"
                src={homepageImages.vib}
              />
              <div className="absolute bottom-3 right-3 bg-accent-strawberry text-white px-3 py-1.5 font-black text-sm border-2 border-text-chocolate rounded-md rotate-3 shadow-sticker-sm">
                #SPICY
              </div>
              <div className="absolute bottom-3 left-3 bg-accent-mango text-white px-3 py-1.5 font-black text-sm border-2 border-text-chocolate rounded-md -rotate-2 shadow-sticker-sm">
                #tangy
              </div>
              <div className="absolute top-3 right-3 bg-amber-400 text-text-chocolate px-3 py-1.5 font-black text-sm border-2 border-text-chocolate rounded-md rotate-2 shadow-sticker-sm">
                #sweet
              </div>
            </div>
          </motion.div>

          {/* Orange quote bubble: new testimonial + @snackqueen_24 + VERIFIED BUYER + #TREATY */}
          <motion.div
            className="md:col-span-2 bg-accent-mango border-4 border-text-chocolate p-6 md:p-8 flex flex-col justify-center relative overflow-hidden shadow-sticker rotate-1 hover:rotate-0 transition-transform min-h-[220px]"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span
              className="absolute top-2 right-4 text-white/25 text-8xl md:text-9xl font-serif leading-none select-none"
              aria-hidden
            >
              &quot;
            </span>
            <blockquote className="relative z-10 text-text-chocolate text-xl md:text-2xl font-black leading-snug brand-font mb-5 pr-8">
              &quot;Literally my entire personality now. This isn&apos;t just a
              snack, it&apos;s a mood. Treat yourself, you deserve it.&quot;
            </blockquote>
            <div className="relative z-10 flex items-center gap-3 bg-white/80 p-3 border-2 border-text-chocolate w-fit transform -rotate-1 shadow-sticker-sm">
              <div className="w-10 h-10 rounded-full bg-primary border-2 border-text-chocolate flex-shrink-0" />
              <div>
                <p className="text-text-chocolate font-black text-base leading-none">
                  @snackqueen_24
                </p>
                <p className="text-text-chocolate/80 text-xs font-bold uppercase">
                  Verified Buyer
                </p>
              </div>
            </div>
            <p
              className="absolute bottom-2 right-4 text-text-chocolate font-black text-sm opacity-30 rotate-3 hand-font"
              aria-hidden
            >
              #TREATY
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
