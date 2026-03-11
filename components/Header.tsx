"use client";
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

const HOME_NAV = [
  { label: 'Flavors', href: '/#flavors' },
  { label: 'The Vibe', href: '/#vibe' },
  { label: 'About us', href: '/about' },
  { label: 'Contact us', href: '/#contact' },
];

const FULL_NAV = [
  { label: 'Shop All', href: '/shop' },
  { label: 'About us', href: '/about' },
];

export function Header({ sticky = false }: { sticky?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, userName, logout } = useAuth();
  const { cartCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
    close();
  };
  const isHomepage = pathname === '/';
  const navLinks = isHomepage ? HOME_NAV : FULL_NAV;

  const close = () => setMenuOpen(false);

  const navLinkContent = (label: string) => (
    <motion.span
      className="block text-base font-black uppercase tracking-wide text-text-chocolate hover:text-primary transition-colors"
      whileHover={{ rotate: -2 }}
    >
      {label}
    </motion.span>
  );

  return (
    <header
      className={`fixed left-0 w-full z-40 transition-all duration-300 bg-white/80 backdrop-blur-md border-b-2 border-text-chocolate ${sticky ? 'top-0' : 'top-9'}`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-2.5 md:py-4 flex items-center justify-between min-h-[3.25rem] md:min-h-[8rem]">
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0"
          onClick={() => {
            close();
            if (pathname === '/') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        >
          <motion.span
            className="relative inline-block"
            whileHover={{ scale: 1.05, rotate: 4 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <span className="absolute -top-0.5 right-0 text-text-chocolate font-bold text-[0.4em] leading-none select-none">™</span>
            <img src="/logo1.svg" alt="Snacqo" className="h-10 md:h-20 w-auto min-w-[3.5rem] md:min-w-[6.5rem] object-contain" />
          </motion.span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(({ label, href }) => {
            const isRoute = href === '/shop' || href === '/account';
            const isActive = isRoute && pathname === href;
            return (
              <Link key={href} href={href}>
                <motion.span
                  className={`block text-base font-black uppercase tracking-wide transition-colors ${
                    isActive ? 'text-primary' : 'text-text-chocolate hover:text-primary'
                  }`}
                  whileHover={{ rotate: -2 }}
                >
                  {label}
                </motion.span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          {isHomepage ? (
            <>
              {isLoggedIn ? (
                <Link
                  href="/account"
                  className="hidden sm:flex items-center gap-2 font-bold text-text-chocolate hover:text-primary transition-colors"
                >
                  <span className="w-8 h-8 rounded-full bg-accent-mango border-2 border-text-chocolate flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">person</span>
                  </span>
                  <span>Hi, {userName || 'Snacker'}!</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:block text-sm font-black uppercase tracking-wide text-text-chocolate hover:text-primary transition-colors"
                >
                  Log in
                </Link>
              )}
              <Link href="/shop">
                <motion.span
                  className="hidden sm:flex bg-accent-mango text-text-chocolate px-6 py-2.5 rounded-none border-2 border-text-chocolate text-sm font-black uppercase shadow-sticker-sm cursor-pointer"
                  whileHover={{ backgroundColor: '#FF6B6B', color: 'white', rotate: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Shop All
                </motion.span>
              </Link>
            </>
          ) : (
            <>
              {isLoggedIn ? (
                <>
                  <Link
                    href="/account/orders"
                    className={`hidden sm:flex items-center gap-1.5 text-sm font-black uppercase tracking-wide transition-colors ${pathname === '/account/orders' ? 'text-primary' : 'text-text-chocolate hover:text-primary'}`}
                  >
                    <span className="material-symbols-outlined text-base">receipt_long</span>
                    My Orders
                  </Link>
                  <Link
                    href="/account"
                    className="hidden sm:flex items-center gap-2 font-bold text-text-chocolate hover:text-primary transition-colors"
                  >
                    <span className="w-8 h-8 rounded-full bg-accent-mango border-2 border-text-chocolate flex items-center justify-center">
                      <span className="material-symbols-outlined text-sm">person</span>
                    </span>
                    <span>Hi, {userName || 'Snacker'}!</span>
                  </Link>
                </>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:block text-sm font-black uppercase tracking-wide text-text-chocolate hover:text-primary transition-colors"
                >
                  Log in
                </Link>
              )}
              <Link href="/cart" className="relative inline-block">
                <motion.span
                  className="hidden sm:inline-flex relative bg-accent-mango text-text-chocolate px-6 py-2.5 rounded-none border-2 border-text-chocolate text-sm font-black uppercase shadow-sticker-sm cursor-pointer"
                  whileHover={{ backgroundColor: '#FF6B6B', color: 'white', rotate: -3, scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  My Cart
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1 bg-accent-mango border-2 border-text-chocolate rounded-full text-xs font-bold flex items-center justify-center animate-bounce">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </motion.span>
                <span className="sm:hidden relative inline-flex bg-accent-mango text-text-chocolate px-4 py-2 rounded-none border-2 border-text-chocolate text-sm font-black uppercase shadow-sticker-sm">
                  My Cart
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1 bg-accent-mango border-2 border-text-chocolate rounded-full text-xs font-bold flex items-center justify-center animate-bounce">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </span>
              </Link>
            </>
          )}

          {/* Mobile: hamburger + account icon side by side */}
          <div className="md:hidden flex items-center gap-2">
            <button
              type="button"
              className="text-text-chocolate p-2 border-2 border-text-chocolate bg-white shadow-[2px_2px_0px_0px_#2D1B0E]"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <span className="material-symbols-outlined font-black">
                {menuOpen ? 'close' : 'menu'}
              </span>
            </button>
            <Link
              href={isLoggedIn ? '/account' : '/login'}
              className="text-text-chocolate p-2 border-2 border-text-chocolate bg-white shadow-[2px_2px_0px_0px_#2D1B0E] hover:bg-secondary transition-colors"
              aria-label={isLoggedIn ? 'Account' : 'Log in'}
            >
              <span className="material-symbols-outlined font-black">person</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white/95 backdrop-blur-md border-t-2 border-text-chocolate px-6 py-6 flex flex-col gap-5"
          >
            {navLinks.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={close}
                className="text-lg font-black uppercase tracking-wide text-text-chocolate hover:text-primary transition-colors"
              >
                {label}
              </Link>
            ))}
            {isHomepage ? (
              <>
                {isLoggedIn ? (
                  <>
                    <Link href="/account" onClick={close} className="text-lg font-black uppercase tracking-wide text-text-chocolate hover:text-primary transition-colors flex items-center gap-2">
                      <span className="material-symbols-outlined">person</span>
                      Hi, {userName || 'Snacker'}!
                    </Link>
                    <button type="button" onClick={handleLogout} className="text-lg font-black uppercase tracking-wide text-text-chocolate hover:text-primary transition-colors flex items-center gap-2 text-left">
                      <span className="material-symbols-outlined">logout</span>
                      Log out
                    </button>
                  </>
                ) : (
                  <Link href="/login" onClick={close} className="text-lg font-black uppercase tracking-wide text-text-chocolate hover:text-primary transition-colors">
                    Log in
                  </Link>
                )}
                <Link href="/shop" onClick={close} className="mt-2 inline-block bg-accent-mango text-text-chocolate px-6 py-3 border-2 border-text-chocolate text-sm font-black uppercase shadow-sticker-sm text-center">
                  Shop All
                </Link>
              </>
            ) : (
              <>
                {isLoggedIn ? (
                  <>
                    <Link href="/account/orders" onClick={close} className="text-lg font-black uppercase tracking-wide text-text-chocolate hover:text-primary transition-colors flex items-center gap-2">
                      <span className="material-symbols-outlined">receipt_long</span>
                      My Orders
                    </Link>
                    <Link href="/account" onClick={close} className="text-lg font-black uppercase tracking-wide text-text-chocolate hover:text-primary transition-colors flex items-center gap-2">
                      <span className="material-symbols-outlined">person</span>
                      Hi, {userName || 'Snacker'}!
                    </Link>
                    <button type="button" onClick={handleLogout} className="text-lg font-black uppercase tracking-wide text-text-chocolate hover:text-primary transition-colors flex items-center gap-2 text-left">
                      <span className="material-symbols-outlined">logout</span>
                      Log out
                    </button>
                  </>
                ) : (
                  <Link href="/login" onClick={close} className="text-lg font-black uppercase tracking-wide text-text-chocolate hover:text-primary transition-colors">
                    Log in
                  </Link>
                )}
                <Link href="/cart" onClick={close} className="mt-2 relative inline-flex bg-accent-mango text-text-chocolate px-6 py-3 border-2 border-text-chocolate text-sm font-black uppercase shadow-sticker-sm text-center">
                  My Cart
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1 bg-accent-mango border-2 border-text-chocolate rounded-full text-xs font-bold flex items-center justify-center animate-bounce">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
