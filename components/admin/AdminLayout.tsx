"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/coupons", label: "Coupons" },
  { href: "/admin/campuses", label: "Campuses" },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    router.replace("/admin/login");
  };

  const SidebarContent = () => (
    <>
      <div className="p-4 border-b border-slate-700 flex items-center gap-2">
        <Image
          src="/logo1.svg"
          alt="Snacqo"
          width={32}
          height={32}
          className="h-8 w-auto object-contain flex-shrink-0"
        />
        <span className="font-bold text-lg tracking-tight">Snacqo Admin</span>
      </div>
      <nav className="flex-1 p-3 space-y-0.5">
        {NAV_ITEMS.map(({ href, label }) => {
          const isActive =
            href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-slate-600 text-white"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </>
  );

  return (
    <div className="min-h-screen flex bg-slate-100">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-56 bg-slate-800 text-white flex flex-col shrink-0
          transform transition-transform duration-200 ease-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <SidebarContent />
      </aside>

      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-md text-slate-600 hover:bg-slate-100"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <Image
              src="/logo1.svg"
              alt="Snacqo"
              width={28}
              height={28}
              className="h-7 w-auto object-contain hidden sm:block"
            />
            <span className="text-slate-600 text-sm font-medium truncate">Admin</span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="px-3 sm:px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors shrink-0"
          >
            Logout
          </button>
        </header>

        <main className="flex-1 overflow-auto min-h-0">{children}</main>
      </div>
    </div>
  );
}
