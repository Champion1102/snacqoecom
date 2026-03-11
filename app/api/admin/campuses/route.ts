import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const auth = requireAdmin(req);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
    const campuses = await prisma.campus.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] });
    return NextResponse.json({ campuses });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = requireAdmin(req);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
    const body = (await req.json()) as { name?: string; line1?: string; line2?: string | null; city?: string; state?: string; pincode?: string; sortOrder?: number };
    const name = typeof body.name === "string" ? body.name.trim() : undefined;
    const line1 = typeof body.line1 === "string" ? body.line1.trim() : undefined;
    const line2 = body.line2 != null ? (typeof body.line2 === "string" ? body.line2.trim() : null) : null;
    const city = typeof body.city === "string" ? body.city.trim() : undefined;
    const state = typeof body.state === "string" ? body.state.trim() : undefined;
    const pincode = typeof body.pincode === "string" ? body.pincode.trim() : undefined;
    const sortOrder = typeof body.sortOrder === "number" ? body.sortOrder : 0;

    if (!name || !line1 || !city || !state || !pincode) return NextResponse.json({ error: "name, line1, city, state, and pincode are required." }, { status: 400 });

    const campus = await prisma.campus.create({ data: { name, line1, line2, city, state, pincode, sortOrder } });
    return NextResponse.json({ campus }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
