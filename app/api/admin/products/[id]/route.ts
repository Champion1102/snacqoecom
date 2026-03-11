import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const productInclude = {
  category: { select: { id: true, name: true, slug: true } },
  images: { orderBy: { sortOrder: "asc" as const }, select: { id: true, url: true, sortOrder: true } },
  variants: { orderBy: { name: "asc" as const }, select: { id: true, name: true, sku: true, price: true, compareAtPrice: true, stock: true, weightGrams: true, isActive: true, outOfStock: true } },
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAdmin(req);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
    const { id } = await params;
    const product = await prisma.product.findUnique({ where: { id }, include: productInclude });
    if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });
    return NextResponse.json({ product });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

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
    if (typeof body.slug === "string") data.slug = body.slug.trim().toLowerCase().replace(/\s+/g, "-");
    if (typeof body.categoryId === "string") data.categoryId = body.categoryId.trim();
    if (typeof body.description === "string") data.description = body.description.trim();
    if (body.shortDescription !== undefined) data.shortDescription = body.shortDescription === null || body.shortDescription === "" ? null : String(body.shortDescription).trim();
    if (body.ingredients !== undefined) data.ingredients = body.ingredients === null || body.ingredients === "" ? null : String(body.ingredients).trim();
    if (body.cardLabel !== undefined) data.cardLabel = body.cardLabel === null || body.cardLabel === "" ? null : String(body.cardLabel).trim();
    if (body.nutrition !== undefined) {
      if (body.nutrition == null) data.nutrition = Prisma.DbNull;
      else if (Array.isArray(body.nutrition)) {
        const normalized = body.nutrition.map((row) => { if (!row || typeof row !== "object") return null; const r = row as { label?: unknown; value?: unknown }; const label = typeof r.label === "string" ? r.label.trim() : ""; const value = typeof r.value === "string" ? r.value.trim() : ""; if (!label || !value) return null; return { label, value }; }).filter(Boolean);
        data.nutrition = normalized.length > 0 ? normalized : Prisma.DbNull;
      } else {
        return NextResponse.json({ error: "nutrition must be an array of { label, value }." }, { status: 400 });
      }
    }
    if (typeof body.isActive === "boolean") data.isActive = body.isActive;
    if (typeof body.sortOrder === "number") data.sortOrder = body.sortOrder;

    if (Object.keys(data).length === 0) return NextResponse.json({ error: "No valid fields to update." }, { status: 400 });

    const product = await prisma.product.update({ where: { id }, data, include: productInclude });
    return NextResponse.json({ product });
  } catch (e: unknown) {
    if (e && typeof e === "object" && "code" in e) {
      const code = (e as { code: string }).code;
      if (code === "P2025") return NextResponse.json({ error: "Product not found." }, { status: 404 });
      if (code === "P2002") return NextResponse.json({ error: "Slug or category conflict." }, { status: 409 });
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
    const product = await prisma.product.update({ where: { id }, data: { isActive: false }, include: productInclude });
    return NextResponse.json({ product });
  } catch (e: unknown) {
    if (e && typeof e === "object" && "code" in e && (e as { code: string }).code === "P2025") return NextResponse.json({ error: "Product not found." }, { status: 404 });
    console.error(e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
