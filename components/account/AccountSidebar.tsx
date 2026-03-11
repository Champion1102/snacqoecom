"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const NAV_ITEMS = [
  { href: '/account', label: 'Overview', icon: 'dashboard', exact: true },
  { href: '/account/orders', label: 'Orders', icon: 'package_2', exact: false },
  { href: '/account/addresses', label: 'Addresses', icon: 'location_on', exact: false },
  { href: '/account/profile', label: 'Profile', icon: 'person', exact: false },
];

export function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <>
      {/* Desktop: vertical sidebar */}
      <aside className="hidden lg:flex lg:col-span-3 flex-col gap-4">
        <nav className="flex flex-col gap-3">
          {NAV_ITEMS.map(({ href, label, icon, exact }) => (
            <Link
              key={href}
              href={href}
              className={`sidebar-link flex items-center gap-3 px-5 py-3 border-2 border-text-chocolate bg-white text-text-chocolate font-bold uppercase product-font tracking-wide text-lg transition-all rounded-sm ${
                isActive(href, exact)
                  ? 'active'
                  : 'hover:shadow-[4px_4px_0px_0px_#2D1B0E] hover:bg-secondary hover:-translate-y-1'
              }`}
            >
              <span className="material-symbols-outlined">{icon}</span>
              {label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-auto flex items-center justify-center gap-2 px-5 py-3 border-2 border-text-chocolate text-text-chocolate font-bold uppercase product-font tracking-wide text-base hover:bg-red-50 hover:text-primary transition-all rounded-sm"
        >
          <span className="material-symbols-outlined">logout</span>
          Log Out
        </button>
      </aside>

      {/* Mobile: bottom sticky navbar with icons + names */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t-4 border-text-chocolate shadow-[0_-4px_0_0_#E0F7FA] flex items-stretch"
        aria-label="Account navigation"
      >
        {NAV_ITEMS.map(({ href, label, icon, exact }) => (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 px-1 min-w-0 transition-colors ${
              isActive(href, exact)
                ? 'bg-accent-mango text-text-chocolate font-bold'
                : 'text-text-chocolate/80 hover:bg-secondary/50'
            }`}
          >
            <span className="material-symbols-outlined text-2xl shrink-0">{icon}</span>
            <span className="text-[10px] font-bold uppercase product-font tracking-wide truncate w-full text-center">
              {label}
            </span>
          </Link>
        ))}
      </nav>
    </>
  );
}
