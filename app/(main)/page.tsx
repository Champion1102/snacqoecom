"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Hero } from "@/components/Hero";
import { Flavors } from "@/components/Flavors";
import { VibeCheck } from "@/components/VibeCheck";
import { Contact } from "@/components/Contact";
import { Marquee } from "@/components/Marquee";
import { Suspense } from "react";

function HomePageContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [searchParams]);

  return (
    <>
      <span
        className="absolute top-32 left-10 z-0 hidden lg:block material-symbols-outlined text-6xl text-accent-strawberry rotate-12"
        style={{ fontVariationSettings: "'FILL' 1" }}
        aria-hidden
      >
        star
      </span>
      <span
        className="absolute top-48 right-20 z-0 hidden lg:block material-symbols-outlined text-5xl text-accent-mango -rotate-12 animate-pulse"
        style={{ fontVariationSettings: "'FILL' 1" }}
        aria-hidden
      >
        bolt
      </span>
      <Hero />
      <Marquee variant="middle" />
      <Flavors />
      <VibeCheck />
      <Contact />
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <HomePageContent />
    </Suspense>
  );
}
