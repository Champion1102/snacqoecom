import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

function sanitizeUser(user: { id: string; email: string; firstName: string | null; lastName: string | null; role: string }) {
  const userName =
    [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
    user.email.split("@")[0] ||
    "Snacker";
  return { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, userName, role: user.role };
}

export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const user = await prisma.user.findUnique({
      where: { id: auth.user.id },
      select: { id: true, email: true, firstName: true, lastName: true, role: true },
    });
    if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });
    return NextResponse.json({ user: sanitizeUser(user) });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
