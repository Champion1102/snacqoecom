"use client";
import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { homepageImages } from '@/config/homepage-images';

type FlavorCard = {
  id: string;
  tag: string;
  title: string;
  desc: string;
  cta: string;
  bgShadow: string;
  cardBg: string;
  btnClass: string;
  icon: string;
  image: string;
  rotateClass: string;
  tapeRotate: string;
  bestSeller?: boolean;
};

const cards: FlavorCard[] = [
  {
    id: 'dark-choco-almond',
    tag: 'ALMONDS',
    title: 'Dark Chocolate Almond',
    desc: 'Rich, velvety, and antioxidant-packed.',
    cta: 'I need this',
    bgShadow: 'bg-text-chocolate',
    cardBg: 'bg-secondary',
    btnClass: 'bg-secondary',
    icon: 'water_drop',
    image: homepageImages.flavors.darkchocolatealmonds,
    rotateClass: 'md:-rotate-2',
    tapeRotate: '0deg',
  },
  {
    id: 'double-choco-mocha',
    tag: 'ALMONDS',
    title: 'Double Choco Mocha Almond',
    desc: 'A bold fusion of cocoa and aromatic mocha.',
    cta: 'Gimme',
    bgShadow: 'bg-text-chocolate',
    cardBg: 'bg-secondary',
    btnClass: 'bg-secondary',
    icon: 'coffee',
    image: homepageImages.flavors.doublechocomochaalmonds,
    rotateClass: 'md:rotate-2',
    tapeRotate: '15deg',
    bestSeller: true,
  },
  {
    id: 'mango-kesar-kulfi',
    tag: 'CASHEWS',
    title: 'Kesar Kulfi Cashew',
    desc: 'A royal, dessert-like nostalgic treat.',
    cta: 'Feed the craving',
    bgShadow: 'bg-accent-mango',
    cardBg: 'bg-accent-mango/20',
    btnClass: 'bg-accent-mango',
    icon: 'emoji_events',
    image: homepageImages.flavors.kesarkulficashews,
    rotateClass: 'md:-rotate-1',
    tapeRotate: '-10deg',
  },
  {
    id: 'strawberry-cashew',
    tag: 'CASHEWS',
    title: 'Strawberry Cashew',
    desc: 'Sweet, fruity, and irresistibly smooth.',
    cta: 'Yes please',
    bgShadow: 'bg-accent-strawberry',
    cardBg: 'bg-accent-strawberry/20',
    btnClass: 'bg-accent-strawberry',
    icon: 'cake',
    image: homepageImages.flavors.strawberrycashews,
    rotateClass: 'md:rotate-1',
    tapeRotate: '-8deg',
  },
  {
    id: 'pizza-cashew',
    tag: 'CASHEWS',
    title: 'Pizza Cashew',
    desc: 'Savory, tangy, and addictive party snack.',
    cta: 'Grab & go',
    bgShadow: 'bg-primary',
    cardBg: 'bg-primary/10',
    btnClass: 'bg-primary text-white',
    icon: 'local_fire_department',
    image: homepageImages.flavors.pizzacashews,
    rotateClass: 'md:-rotate-2',
    tapeRotate: '5deg',
  },
  {
    id: 'chocolate-almonds',
    tag: 'ALMONDS',
    title: 'Chocolate Almonds',
    desc: 'The classic, balanced sweet-and-nutty snack.',
    cta: 'Lock it in!',
    bgShadow: 'bg-text-chocolate',
    cardBg: 'bg-secondary',
    btnClass: 'bg-secondary',
    icon: 'redeem',
    image: homepageImages.flavors.chocolatealmonds,
    rotateClass: 'md:rotate-1',
    tapeRotate: '-5deg',
  },
];

function FlavorCardContent({ card }: { card: FlavorCard }) {
  return (
    <>
      <div
        className={`absolute inset-0 ${card.bgShadow} translate-y-3 translate-x-3 w-full h-full`}
      />
      <div className="relative bg-white border-4 border-text-chocolate p-6 h-full flex flex-col items-center text-center">
        {card.bestSeller && (
          <div className="absolute -right-4 -top-4 bg-primary text-white font-black text-sm px-4 py-2 border-2 border-text-chocolate shadow-sticker-sm rotate-12 z-30">
            BEST SELLER
          </div>
        )}
        <div
          className={`w-full aspect-square ${card.cardBg} border-2 border-text-chocolate mb-6 overflow-hidden relative`}
        >
          {card.image ? (
            <img
              src={card.image}
              alt={card.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-[#E6E6E6]">
              <span
                className="material-symbols-outlined text-8xl text-text-chocolate/20 group-hover:text-text-chocolate transition-colors duration-300"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {card.icon}
              </span>
            </div>
          )}
          <div className="absolute top-2 right-2 bg-text-chocolate text-white text-xs font-bold px-2 py-1 rotate-3">
            {card.tag}
          </div>
        </div>
        <h3 className="text-3xl font-black text-text-chocolate mb-2 brand-font uppercase leading-none md:transform md:-rotate-1">
          {card.title}
        </h3>
        <p className="text-text-chocolate font-medium mb-6 leading-tight mt-2">
          {card.desc}
        </p>
        <div className="mt-auto w-full">
          <motion.button
            type="button"
            className={`w-full py-3 ${card.btnClass} border-2 border-text-chocolate font-black uppercase shadow-[2px_2px_0px_0px_#2D1B0E] hover:bg-text-chocolate hover:text-white transition-colors`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {card.cta}
          </motion.button>
        </div>
        <div
          className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-6 tape-strip"
          style={{ rotate: card.tapeRotate }}
        />
      </div>
    </>
  );
}

export function Flavors() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const first = el.querySelector('[data-flavor-slide]') as HTMLElement | null;
      const slideWidth = first ? first.offsetWidth + 16 : el.clientWidth * 0.92;
      const index = Math.round(el.scrollLeft / slideWidth);
      setActiveIndex(Math.min(Math.max(0, index), cards.length - 1));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const goToSlide = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const first = el.querySelector('[data-flavor-slide]') as HTMLElement | null;
    const step = first ? first.offsetWidth + 16 : el.clientWidth * 0.92;
    el.scrollTo({ left: index * step, behavior: 'smooth' });
  };

  return (
    <section className="py-20 px-6 relative" id="flavors">
      <svg
        className="absolute top-20 left-10 w-24 h-24 text-primary/20 -rotate-12 z-0"
        fill="currentColor"
        viewBox="0 0 100 100"
      >
        <path d="M50 0 L61 35 L98 35 L68 57 L79 91 L50 70 L21 91 L32 57 L2 35 L39 35 Z" />
      </svg>
      <svg
        className="absolute bottom-20 right-10 w-32 h-32 text-accent-mango/20 rotate-45 z-0"
        fill="currentColor"
        viewBox="0 0 100 100"
      >
        <circle cx="50" cy="50" r="45" />
      </svg>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20 relative">
          <span className="absolute -top-10 right-1/3 rotate-12 hand-font text-primary text-xl">
            Pick your player ⤵
          </span>
          <h2 className="text-5xl md:text-7xl font-black text-text-chocolate mb-4 brand-font uppercase tracking-tight">
            The Lineup
          </h2>
          <div className="h-2 w-32 bg-accent-strawberry mx-auto rotate-2" />
        </div>

        {/* Mobile: horizontal slideshow */}
        <div className="md:hidden">
          <div
            ref={scrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-2 -mx-4 px-4 scrollbar-hide"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {cards.map((card) => (
              <motion.div
                key={card.id}
                data-flavor-slide
                className="flex-shrink-0 w-[88vw] max-w-[340px] snap-center group relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className={`relative ${card.rotateClass}`}>
                  <FlavorCardContent card={card} />
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-center gap-2 mt-6">
            {cards.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goToSlide(i)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  i === activeIndex ? 'bg-text-chocolate scale-125' : 'bg-text-chocolate/30 hover:bg-text-chocolate/50'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop: grid */}
        <div className="hidden md:grid grid-cols-3 gap-12 px-4">
          {cards.map((card, i) => (
            <motion.div
              key={card.id}
              className={`group relative ${i === 1 ? 'md:-mt-12' : ''} ${card.rotateClass}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ rotate: 0, zIndex: 20 }}
              transition={{ duration: 0.3 }}
            >
              <FlavorCardContent card={card} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
