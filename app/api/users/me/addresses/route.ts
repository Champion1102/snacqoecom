import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
    const addresses = await prisma.address.findMany({ where: { userId: auth.user.id }, orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }] });
    return NextResponse.json({ addresses });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const body = (await req.json()) as Record<string, unknown>;
    const label = typeof body.label === "string" ? body.label.trim() : undefined;
    const name = typeof body.name === "string" ? body.name.trim() : undefined;
    const phone = typeof body.phone === "string" ? body.phone.trim() : undefined;
    const line1 = typeof body.line1 === "string" ? body.line1.trim() : undefined;
    const line2 = typeof body.line2 === "string" ? body.line2.trim() : null;
    const city = typeof body.city === "string" ? body.city.trim() : undefined;
    const state = typeof body.state === "string" ? body.state.trim() : undefined;
    const pincode = typeof body.pincode === "string" ? body.pincode.trim() : undefined;
    const isDefault = body.isDefault === true;

    if (!label || !name || !phone || !line1 || !city || !state || !pincode) {
      return NextResponse.json({ error: "Missing required fields: label, name, phone, line1, city, state, pincode." }, { status: 400 });
    }

    if (isDefault) await prisma.address.updateMany({ where: { userId: auth.user.id }, data: { isDefault: false } });

    const address = await prisma.address.create({
      data: { userId: auth.user.id, label, name, phone, line1, line2: line2 || undefined, city, state, pincode, isDefault: isDefault || false },
    });
    return NextResponse.json({ address }, { status: 201 });
  } catch (e: unknown) {
    if (e && typeof e === "object" && "code" in e && (e as { code: string }).code === "P2002") return NextResponse.json({ error: "An address with this label already exists." }, { status: 409 });
    console.error(e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
