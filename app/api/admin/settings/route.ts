import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const auth = requireAdmin(req);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
    const row = await prisma.setting.findUnique({ where: { key: "allow_multiple_coupons" } });
    return NextResponse.json({ allowMultipleCoupons: row?.value === "true" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = requireAdmin(req);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
    const body = (await req.json()) as { allowMultipleCoupons?: boolean };
    if (typeof body.allowMultipleCoupons !== "boolean") return NextResponse.json({ error: "allowMultipleCoupons (boolean) is required." }, { status: 400 });

    await prisma.setting.upsert({
      where: { key: "allow_multiple_coupons" },
      create: { key: "allow_multiple_coupons", value: body.allowMultipleCoupons ? "true" : "false" },
      update: { value: body.allowMultipleCoupons ? "true" : "false" },
    });
    return NextResponse.json({ allowMultipleCoupons: body.allowMultipleCoupons });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
