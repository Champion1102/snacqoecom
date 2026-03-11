import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { verifyToken, type JwtPayload } from "./jwt";

export const COOKIE_NAME = "snacqo_token";
export const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  userName: string;
}

function extractToken(req?: NextRequest): string | null {
  if (req) {
    const cookie = req.cookies.get(COOKIE_NAME)?.value;
    if (cookie) return cookie;
    const auth = req.headers.get("authorization");
    if (auth?.startsWith("Bearer ")) return auth.slice(7);
    return null;
  }
  return null;
}

async function extractTokenFromCookies(): Promise<string | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME)?.value;
  if (cookie) return cookie;
  return null;
}

/** For use in Route Handlers that receive NextRequest */
export function getAuthFromRequest(req: NextRequest): AuthUser | null {
  const token = extractToken(req);
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload) return null;
  return { id: payload.sub, email: payload.email, role: payload.role, userName: payload.userName };
}

/** For use in Server Components / Server Actions using next/headers */
export async function getAuth(): Promise<AuthUser | null> {
  const token = await extractTokenFromCookies();
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload) return null;
  return { id: payload.sub, email: payload.email, role: payload.role, userName: payload.userName };
}

export function requireAuth(req: NextRequest): { user: AuthUser } | { error: string; status: number } {
  const user = getAuthFromRequest(req);
  if (!user) return { error: "Unauthorized", status: 401 };
  return { user };
}

export function requireAdmin(req: NextRequest): { user: AuthUser } | { error: string; status: number } {
  const result = requireAuth(req);
  if ("error" in result) return result;
  if (result.user.role !== "ADMIN") return { error: "Forbidden", status: 403 };
  return { user: result.user };
}

export function optionalAuth(req: NextRequest): AuthUser | null {
  return getAuthFromRequest(req);
}

export function getCartSessionFromRequest(req: NextRequest): string | null {
  return req.cookies.get("cart_session")?.value ?? null;
}

export function cookieOptions(isProduction: boolean) {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: (isProduction ? "none" : "lax") as "none" | "lax",
    maxAge: COOKIE_MAX_AGE_MS / 1000,
    path: "/",
  };
}
