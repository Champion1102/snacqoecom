import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const auth = requireAdmin(req);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true, slug: true, sortOrder: true, createdAt: true, updatedAt: true, _count: { select: { products: true } } },
    });
    return NextResponse.json({ categories });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = requireAdmin(req);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
    const body = (await req.json()) as { name?: string; slug?: string; sortOrder?: number };
    const name = typeof body.name === "string" ? body.name.trim() : undefined;
    const slug = typeof body.slug === "string" ? body.slug.trim().toLowerCase().replace(/\s+/g, "-") : undefined;
    const sortOrder = typeof body.sortOrder === "number" ? body.sortOrder : 0;

    if (!name || !slug) return NextResponse.json({ error: "name and slug are required." }, { status: 400 });

    const category = await prisma.category.create({ data: { name, slug, sortOrder } });
    return NextResponse.json({ category }, { status: 201 });
  } catch (e: unknown) {
    if (e && typeof e === "object" && "code" in e && (e as { code: string }).code === "P2002") return NextResponse.json({ error: "A category with this slug already exists." }, { status: 409 });
    console.error(e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
