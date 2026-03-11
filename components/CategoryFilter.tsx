"use client";
import { motion } from 'framer-motion';

export type ProductCategory = string;

interface CategoryFilterProps {
  categories: { id: string; label: string }[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({ categories, activeCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap justify-center gap-4 category-scroll overflow-x-auto pb-2">
      {categories.map(({ id, label }) => {
        const isActive = activeCategory === id;
        return (
          <motion.button
            key={id}
            type="button"
            className={`px-6 py-2 border-2 border-text-chocolate font-bold tracking-wider btn-text shadow-[3px_3px_0px_0px_#2D1B0E] text-sm md:text-base transition-all ${
              isActive
                ? 'bg-accent-mango text-text-chocolate'
                : 'bg-white text-text-chocolate hover:bg-secondary hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#2D1B0E]'
            }`}
            onClick={() => onCategoryChange(id)}
            whileHover={!isActive ? { y: -2 } : undefined}
            whileTap={{ scale: 0.98 }}
          >
            {label}
          </motion.button>
        );
      })}
    </div>
  );
}
