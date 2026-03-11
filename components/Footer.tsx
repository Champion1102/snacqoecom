"use client";
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-secondary pt-16 pb-8 border-t-4 border-text-chocolate relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none flex flex-col justify-between z-0 overflow-hidden">
        <span className="brand-font text-[10rem] font-black whitespace-nowrap leading-none text-text-chocolate select-none">
          SNACQO SNACQO SNACQO
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
          <Link href="/" className="flex items-center gap-2">
            <span className="relative inline-block">
              <span className="absolute -top-0.5 right-0 text-text-chocolate font-bold text-[0.4em] leading-none select-none">™</span>
              <img src="/logo1.svg" alt="Snacqo" className="h-20 w-auto object-contain" />
            </span>
          </Link>
          <div className="flex flex-col md:flex-row gap-8 md:gap-16">
            <div>
              <h4 className="btn-text font-black text-text-chocolate uppercase tracking-widest mb-4 border-b-2 border-text-chocolate inline-block">
                Socials
              </h4>
              <div className="flex flex-col gap-2">
                <a
                  className="text-text-chocolate font-bold hover:text-primary hover:translate-x-1 transition-all flex items-center gap-2"
                  href="https://www.instagram.com/snacqo/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="material-symbols-outlined text-lg">photo_camera</span>
                  Instagram
                </a>
                <a
                  className="text-text-chocolate font-bold hover:text-primary hover:translate-x-1 transition-all flex items-center gap-2"
                  href="https://www.linkedin.com/company/snacqo/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="material-symbols-outlined text-lg">work</span>
                  LinkedIn
                </a>
              </div>
            </div>
            <div>
              <h4 className="btn-text font-black text-text-chocolate uppercase tracking-widest mb-4 border-b-2 border-text-chocolate inline-block">
                Support
              </h4>
              <div className="flex flex-col gap-2">
                <a
                  href="mailto:support@snacqo.com"
                  className="text-text-chocolate font-bold hover:text-primary hover:translate-x-1 transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">mail</span>
                  support@snacqo.com
                </a>
              </div>
            </div>
            <div>
              <h4 className="btn-text font-black text-text-chocolate uppercase tracking-widest mb-4 border-b-2 border-text-chocolate inline-block">
                Legal Stuff
              </h4>
              <div className="flex flex-col gap-2">
                <Link
                  href="/privacy-policy"
                  className="text-text-chocolate font-bold hover:text-primary hover:translate-x-1 transition-all"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms-and-conditions"
                  className="text-text-chocolate font-bold hover:text-primary hover:translate-x-1 transition-all"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/return-refund-policy"
                  className="text-text-chocolate font-bold hover:text-primary hover:translate-x-1 transition-all"
                >
                  Return & Refund Policy
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center border-t-2 border-text-chocolate/20 pt-8 text-sm font-bold text-text-chocolate/60">
          <p>© 2026 snacQO Snacks Inc. Don&apos;t steal our vibes.</p>
          <p className="mt-2 md:mt-0">Designed for Gen Z, by Gen Z.</p>
        </div>
      </div>
    </footer>
  );
}
