import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-20 text-center relative z-10">
      <h1
        className="text-4xl md:text-5xl text-text-chocolate brand-font uppercase tracking-tight mb-4"
        style={{ textShadow: "2px 2px 0px #E0F7FA" }}
      >
        About us
      </h1>
      <p className="text-xl font-bold text-text-chocolate/80 product-font mb-8">
        Our story is coming soon. Stay tuned!
      </p>
      <Link
        href="/shop"
        className="inline-block bg-primary text-white px-8 py-3 font-bold border-2 border-text-chocolate shadow-[4px_4px_0px_0px_#2D1B0E] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all uppercase tracking-wider btn-text"
      >
        Shop All
      </Link>
    </div>
  );
}
