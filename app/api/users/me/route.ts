import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const user = await prisma.user.findUnique({
      where: { id: auth.user.id },
      select: { id: true, email: true, firstName: true, lastName: true, phone: true, birthday: true, newsletter: true },
    });
    if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });
    return NextResponse.json({ user: { ...user, birthday: user.birthday ? user.birthday.toISOString().slice(0, 10) : null } });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const body = (await req.json()) as Record<string, unknown>;
    const updates: { firstName?: string | null; lastName?: string | null; phone?: string | null; birthday?: Date | null; newsletter?: boolean } = {};

    if (typeof body.firstName === "string") updates.firstName = body.firstName.trim() || null;
    if (typeof body.lastName === "string") updates.lastName = body.lastName.trim() || null;
    if (typeof body.phone === "string") updates.phone = body.phone.trim() || null;
    if (typeof body.newsletter === "boolean") updates.newsletter = body.newsletter;
    if (body.birthday !== undefined && body.birthday !== null) {
      if (typeof body.birthday === "string") { const d = new Date(body.birthday); if (!isNaN(d.getTime())) updates.birthday = d; }
    } else if (body.birthday === null) {
      updates.birthday = null;
    }

    if (Object.keys(updates).length === 0) return NextResponse.json({ error: "No valid fields to update." }, { status: 400 });

    const user = await prisma.user.update({
      where: { id: auth.user.id },
      data: updates,
      select: { id: true, email: true, firstName: true, lastName: true, phone: true, birthday: true, newsletter: true },
    });
    return NextResponse.json({ user: { ...user, birthday: user.birthday ? user.birthday.toISOString().slice(0, 10) : null } });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
