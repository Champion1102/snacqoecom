import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAuth(req);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
    const { id } = await params;

    const existing = await prisma.address.findFirst({ where: { id, userId: auth.user.id } });
    if (!existing) return NextResponse.json({ error: "Address not found." }, { status: 404 });

    const body = (await req.json()) as Record<string, unknown>;
    const updates: Record<string, unknown> = {};
    if (typeof body.label === "string") updates.label = body.label.trim();
    if (typeof body.name === "string") updates.name = body.name.trim();
    if (typeof body.phone === "string") updates.phone = body.phone.trim();
    if (typeof body.line1 === "string") updates.line1 = body.line1.trim();
    if (body.line2 !== undefined) updates.line2 = typeof body.line2 === "string" ? body.line2.trim() || null : null;
    if (typeof body.city === "string") updates.city = body.city.trim();
    if (typeof body.state === "string") updates.state = body.state.trim();
    if (typeof body.pincode === "string") updates.pincode = body.pincode.trim();
    if (typeof body.isDefault === "boolean") updates.isDefault = body.isDefault;

    if (Object.keys(updates).length === 0) return NextResponse.json({ error: "No valid fields to update." }, { status: 400 });
    if (updates.isDefault === true) await prisma.address.updateMany({ where: { userId: auth.user.id }, data: { isDefault: false } });

    const address = await prisma.address.update({ where: { id }, data: updates });
    return NextResponse.json({ address });
  } catch (e: unknown) {
    if (e && typeof e === "object" && "code" in e && (e as { code: string }).code === "P2002") return NextResponse.json({ error: "An address with this label already exists." }, { status: 409 });
    console.error(e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAuth(req);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
    const { id } = await params;

    const existing = await prisma.address.findFirst({ where: { id, userId: auth.user.id } });
    if (!existing) return NextResponse.json({ error: "Address not found." }, { status: 404 });

    await prisma.address.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
