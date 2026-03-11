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
    const body = (await req.json()) as { name?: string; slug?: string; sortOrder?: number };
    const data: { name?: string; slug?: string; sortOrder?: number } = {};
    if (typeof body.name === "string") data.name = body.name.trim();
    if (typeof body.slug === "string") data.slug = body.slug.trim().toLowerCase().replace(/\s+/g, "-");
    if (typeof body.sortOrder === "number") data.sortOrder = body.sortOrder;

    if (Object.keys(data).length === 0) return NextResponse.json({ error: "No valid fields to update." }, { status: 400 });

    const category = await prisma.category.update({ where: { id }, data });
    return NextResponse.json({ category });
  } catch (e: unknown) {
    if (e && typeof e === "object" && "code" in e) {
      const code = (e as { code: string }).code;
      if (code === "P2025") return NextResponse.json({ error: "Category not found." }, { status: 404 });
      if (code === "P2002") return NextResponse.json({ error: "A category with this slug already exists." }, { status: 409 });
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

    const category = await prisma.category.findUnique({ where: { id }, include: { _count: { select: { products: true } } } });
    if (!category) return NextResponse.json({ error: "Category not found." }, { status: 404 });
    if (category._count.products > 0) return NextResponse.json({ error: "Cannot delete category that has products. Remove or reassign products first." }, { status: 400 });

    await prisma.category.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (e: unknown) {
    if (e && typeof e === "object" && "code" in e && (e as { code: string }).code === "P2025") return NextResponse.json({ error: "Category not found." }, { status: 404 });
    console.error(e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
