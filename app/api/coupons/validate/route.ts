import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formatDateTimeIST } from "@/utils/date";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { code?: string; subtotal?: number; isCampusOrder?: boolean; campusId?: string };
    const code = typeof body.code === "string" ? body.code.trim().toUpperCase() : undefined;
    const subtotal = typeof body.subtotal === "number" ? Math.max(0, Math.floor(body.subtotal)) : undefined;
    const isCampusOrder = body.isCampusOrder === true;
    const campusId = typeof body.campusId === "string" ? body.campusId.trim() || undefined : undefined;

    if (!code) return NextResponse.json({ valid: false, message: "Coupon code is required." }, { status: 400 });
    if (subtotal === undefined || subtotal < 0) return NextResponse.json({ valid: false, message: "Valid subtotal (paise) is required." }, { status: 400 });

    const coupon = await prisma.coupon.findUnique({ where: { code } });
    if (!coupon) return NextResponse.json({ valid: false, message: "Invalid coupon code." });
    if (!coupon.isActive) return NextResponse.json({ valid: false, message: "This coupon is no longer active." });

    const now = new Date();
    if (now < coupon.validFrom) return NextResponse.json({ valid: false, message: `This coupon is not yet valid. Valid from ${formatDateTimeIST(coupon.validFrom)}.` });
    if (now > coupon.validTo) return NextResponse.json({ valid: false, message: `This coupon has expired. It was valid until ${formatDateTimeIST(coupon.validTo)}.` });
    if (coupon.minOrderAmount != null && subtotal < coupon.minOrderAmount) {
      return NextResponse.json({ valid: false, message: `Minimum order amount is ₹${(coupon.minOrderAmount / 100).toFixed(0)} to use this coupon.` });
    }
    if (coupon.maxUses != null && coupon.usedCount >= coupon.maxUses) return NextResponse.json({ valid: false, message: "This coupon has reached its usage limit." });
    if (coupon.campusOnly) {
      if (!isCampusOrder) return NextResponse.json({ valid: false, message: "This coupon is only valid for campus delivery orders." });
      const allowedIds = coupon.allowedCampusIds ?? [];
      if (allowedIds.length > 0 && (!campusId || !allowedIds.includes(campusId))) return NextResponse.json({ valid: false, message: "This coupon is not valid for the selected campus." });
    }

    const freeShipping = coupon.type === "FREE_SHIPPING";
    let discountAmount: number;
    let message: string;
    if (freeShipping) { discountAmount = 0; message = "Free shipping applied."; }
    else if (coupon.type === "PERCENT") { discountAmount = Math.floor((subtotal * coupon.value) / 100); message = `You save ₹${(discountAmount / 100).toFixed(2)}.`; }
    else { discountAmount = Math.min(coupon.value, subtotal); message = `You save ₹${(discountAmount / 100).toFixed(2)}.`; }

    return NextResponse.json({ valid: true, discountAmount, freeShipping, message });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
