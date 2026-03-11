"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AdminAuthProvider, useAdminAuth } from "@/contexts/AdminAuthContext";
import { AdminLayout } from "@/components/admin/AdminLayout";

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoggedIn && pathname !== "/admin/login") {
      router.replace("/admin/login");
    }
  }, [isLoggedIn, pathname, router]);

  if (!isLoggedIn && pathname !== "/admin/login") {
    return null;
  }

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return <AdminLayout>{children}</AdminLayout>;
}

export default function AdminSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      <AdminGuard>{children}</AdminGuard>
    </AdminAuthProvider>
  );
}
