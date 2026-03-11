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
    if (typeof body.code === "string") data.code = body.code.trim().toUpperCase();
    if (body.type === "PERCENT" || body.type === "FIXED" || body.type === "FREE_SHIPPING") data.type = body.type;
    if (body.type === "FREE_SHIPPING") data.value = 0;
    else if (typeof body.value === "number") data.value = Math.max(0, Math.floor(body.value));
    if (body.minOrderAmount !== undefined) data.minOrderAmount = body.minOrderAmount == null ? null : Math.max(0, Math.floor(Number(body.minOrderAmount)));
    if (body.maxUses !== undefined) data.maxUses = body.maxUses == null ? null : Math.max(0, Math.floor(Number(body.maxUses)));
    if (typeof body.validFrom === "string") data.validFrom = new Date(body.validFrom);
    if (typeof body.validTo === "string") data.validTo = new Date(body.validTo);
    if (typeof body.isActive === "boolean") data.isActive = body.isActive;
    if (typeof body.campusOnly === "boolean") data.campusOnly = body.campusOnly;
    if (Array.isArray(body.allowedCampusIds)) data.allowedCampusIds = (body.allowedCampusIds as string[]).filter((i): i is string => typeof i === "string").filter(Boolean);

    if (Object.keys(data).length === 0) return NextResponse.json({ error: "No valid fields to update." }, { status: 400 });

    const coupon = await prisma.coupon.update({ where: { id }, data });
    return NextResponse.json({ coupon });
  } catch (e: unknown) {
    if (e && typeof e === "object" && "code" in e) {
      const code = (e as { code: string }).code;
      if (code === "P2025") return NextResponse.json({ error: "Coupon not found." }, { status: 404 });
      if (code === "P2002") return NextResponse.json({ error: "Coupon code already exists." }, { status: 409 });
    }
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
    const { searchParams } = new URL(req.url);
    const hard = searchParams.get("delete") === "true";

    const coupon = await prisma.coupon.findUnique({ where: { id } });
    if (!coupon) return NextResponse.json({ error: "Coupon not found." }, { status: 404 });

    if (hard) {
      await prisma.coupon.delete({ where: { id } });
      return new NextResponse(null, { status: 204 });
    }

    await prisma.coupon.update({ where: { id }, data: { isActive: false } });
    return new NextResponse(null, { status: 204 });
  } catch (e: unknown) {
    if (e && typeof e === "object" && "code" in e && (e as { code: string }).code === "P2025") return NextResponse.json({ error: "Coupon not found." }, { status: 404 });
    console.error(e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
