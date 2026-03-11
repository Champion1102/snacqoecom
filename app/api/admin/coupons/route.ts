import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import type { CouponType } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const auth = requireAdmin(req);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
    const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ coupons });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = requireAdmin(req);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
    const body = (await req.json()) as { code?: string; type?: string; value?: number; minOrderAmount?: number | null; maxUses?: number | null; validFrom?: string; validTo?: string; campusOnly?: boolean; allowedCampusIds?: string[] };
    const code = typeof body.code === "string" ? body.code.trim().toUpperCase() : undefined;
    const typeRaw = body.type?.toString().toUpperCase();
    const isFreeShipping = typeRaw === "FREE_SHIPPING";
    const type = (typeRaw === "FIXED" ? "FIXED" : isFreeShipping ? "FREE_SHIPPING" : "PERCENT") as CouponType;
    const valueInput = typeof body.value === "number" ? Math.max(0, Math.floor(body.value)) : undefined;
    const value = isFreeShipping ? 0 : valueInput;
    const minOrderAmount = body.minOrderAmount != null ? Math.max(0, Math.floor(Number(body.minOrderAmount))) : null;
    const maxUses = body.maxUses != null ? Math.max(0, Math.floor(Number(body.maxUses))) : null;
    const validFrom = body.validFrom ? new Date(body.validFrom) : undefined;
    const validTo = body.validTo ? new Date(body.validTo) : undefined;
    const campusOnly = body.campusOnly === true;
    const allowedCampusIds = Array.isArray(body.allowedCampusIds) ? body.allowedCampusIds.filter((id): id is string => typeof id === "string").filter(Boolean) : [];

    if (!code) return NextResponse.json({ error: "code is required." }, { status: 400 });
    if (!isFreeShipping && valueInput === undefined) return NextResponse.json({ error: "value is required for Percent and Fixed coupons." }, { status: 400 });
    if (!validFrom || !validTo || isNaN(validFrom.getTime()) || isNaN(validTo.getTime())) return NextResponse.json({ error: "validFrom and validTo are required (ISO date strings)." }, { status: 400 });
    if (type === "PERCENT" && (valueInput === undefined || valueInput > 100)) return NextResponse.json({ error: "Percent value must be between 0 and 100." }, { status: 400 });

    const coupon = await prisma.coupon.create({ data: { code, type, value: value ?? 0, minOrderAmount, maxUses, validFrom, validTo, campusOnly, allowedCampusIds } });
    return NextResponse.json({ coupon }, { status: 201 });
  } catch (e: unknown) {
    if (e && typeof e === "object" && "code" in e && (e as { code: string }).code === "P2002") return NextResponse.json({ error: "A coupon with this code already exists." }, { status: 409 });
    console.error(e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
