import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/jwt";
import { COOKIE_NAME, cookieOptions } from "@/lib/auth";

function sanitizeUser(user: { id: string; email: string; firstName: string | null; lastName: string | null; role: string }) {
  const userName =
    [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
    user.email.split("@")[0] ||
    "Admin";
  return { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, userName, role: user.role };
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = (await req.json()) as { email?: string; password?: string };
    if (!email || typeof email !== "string" || !password || typeof password !== "string") {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const normalized = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email: normalized },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, passwordHash: true },
    });

    if (!user || user.role !== "ADMIN" || !user.passwordHash) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const userName =
      [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
      user.email.split("@")[0] ||
      "Admin";
    const token = signToken({ sub: user.id, email: user.email, role: user.role as "USER" | "ADMIN", userName });
    const isProduction = process.env.NODE_ENV === "production";
    const opts = cookieOptions(isProduction);

    const res = NextResponse.json({ user: sanitizeUser(user) });
    res.cookies.set(COOKIE_NAME, token, opts);
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
