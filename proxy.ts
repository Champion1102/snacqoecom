import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow admin login page through without auth check
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Protect all /admin routes (except /admin/login)
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("snacqo_token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) throw new Error("JWT_SECRET not set");
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(secret)
      );
      if (!payload || (payload.role as string) !== "ADMIN") {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
