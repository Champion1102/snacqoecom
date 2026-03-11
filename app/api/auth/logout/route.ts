import { NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/auth";

export async function POST() {
  const isProduction = process.env.NODE_ENV === "production";
  const res = NextResponse.json({ message: "Logged out." });
  res.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 0,
    path: "/",
  });
  return res;
}
