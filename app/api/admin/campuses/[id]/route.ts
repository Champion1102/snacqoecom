import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAdmin(req);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
    const { id } = await params;
    const body = (await req.json()) as Record<string, unknown>;
    const data: Record<string, unknown> = {};
    if (typeof body.name === "string") data.name = body.name.trim();
    if (typeof body.line1 === "string") data.line1 = body.line1.trim();
    if (body.line2 !== undefined) data.line2 = body.line2 == null ? null : String(body.line2).trim();
    if (typeof body.city === "string") data.city = body.city.trim();
    if (typeof body.state === "string") data.state = body.state.trim();
    if (typeof body.pincode === "string") data.pincode = body.pincode.trim();
    if (typeof body.isActive === "boolean") data.isActive = body.isActive;
    if (typeof body.sortOrder === "number") data.sortOrder = body.sortOrder;

    if (Object.keys(data).length === 0) return NextResponse.json({ error: "No valid fields to update." }, { status: 400 });

    const campus = await prisma.campus.update({ where: { id }, data });
    return NextResponse.json({ campus });
  } catch (e: unknown) {
    if (e && typeof e === "object" && "code" in e && (e as { code: string }).code === "P2025") return NextResponse.json({ error: "Campus not found." }, { status: 404 });
    console.error(e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAdmin(req);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
    const { id } = await params;
    await prisma.campus.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (e: unknown) {
    if (e && typeof e === "object" && "code" in e && (e as { code: string }).code === "P2025") return NextResponse.json({ error: "Campus not found." }, { status: 404 });
    console.error(e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
