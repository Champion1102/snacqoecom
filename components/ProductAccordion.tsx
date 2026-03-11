"use client";
import type { ReactNode } from 'react';

interface ProductAccordionProps {
  title: string;
  children: ReactNode;
}

export function ProductAccordion({ title, children }: ProductAccordionProps) {
  return (
    <details className="group bg-white border-2 border-text-chocolate shadow-chunky-sm open:shadow-none open:translate-y-[2px] transition-all">
      <summary className="flex justify-between items-center p-4 cursor-pointer font-bold uppercase btn-text hover:bg-gray-50">
        {title}
        <span className="material-symbols-outlined transition-transform group-open:rotate-180">
          expand_more
        </span>
      </summary>
      <div className="px-4 pb-4 text-text-chocolate/80 leading-relaxed border-t-2 border-text-chocolate bg-secondary/10">
        {children}
      </div>
    </details>
  );
}
