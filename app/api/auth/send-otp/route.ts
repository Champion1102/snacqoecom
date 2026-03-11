import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createAndSendOtp } from "@/services/otp";
import { sendOtpEmail } from "@/services/email";

export async function POST(req: NextRequest) {
  try {
    const { email, intent } = (await req.json()) as { email?: string; intent?: string };
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const normalized = email.trim().toLowerCase();
    const existingUser = await prisma.user.findUnique({ where: { email: normalized }, select: { id: true } });

    if (intent === "login" && !existingUser) {
      return NextResponse.json({ error: "This email is not registered. Please sign up." }, { status: 400 });
    }
    if (intent === "signup" && existingUser) {
      return NextResponse.json({ error: "This email is already registered. Please log in." }, { status: 400 });
    }

    const result = await createAndSendOtp(email, sendOtpEmail);
    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    return NextResponse.json({ message: "OTP sent." });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
