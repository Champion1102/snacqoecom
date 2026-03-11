import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyOtp } from "@/services/otp";
import { signToken } from "@/lib/jwt";
import { COOKIE_NAME, cookieOptions } from "@/lib/auth";

function sanitizeUser(user: { id: string; email: string; firstName: string | null; lastName: string | null; role: string }) {
  const userName =
    [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
    user.email.split("@")[0] ||
    "Snacker";
  return { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, userName, role: user.role };
}

export async function POST(req: NextRequest) {
  try {
    const { email, otp, firstName, lastName } = (await req.json()) as {
      email?: string; otp?: string; firstName?: string; lastName?: string;
    };

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }
    if (!otp || typeof otp !== "string" || otp.length !== 6) {
      return NextResponse.json({ error: "Valid 6-digit OTP is required." }, { status: 400 });
    }

    const normalized = email.trim().toLowerCase();
    const verification = await verifyOtp(normalized, otp.trim());
    if (!verification.valid) {
      return NextResponse.json({ error: verification.message }, { status: 400 });
    }

    let user = await prisma.user.findUnique({ where: { email: normalized } });
    if (user) {
      user = await prisma.user.update({ where: { id: user.id }, data: { emailVerified: true } });
    } else {
      user = await prisma.user.create({
        data: {
          email: normalized,
          emailVerified: true,
          role: "USER",
          firstName: typeof firstName === "string" ? firstName.trim() || null : null,
          lastName: typeof lastName === "string" ? lastName.trim() || null : null,
        },
      });
    }

    const userName =
      [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
      user.email.split("@")[0] ||
      "Snacker";

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
