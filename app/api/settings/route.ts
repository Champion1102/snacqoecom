import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const row = await prisma.setting.findUnique({ where: { key: "allow_multiple_coupons" } });
    return NextResponse.json({ allowMultipleCoupons: row?.value === "true" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
