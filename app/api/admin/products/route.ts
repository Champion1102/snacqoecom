import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const productInclude = {
  category: { select: { id: true, name: true, slug: true } },
  images: { orderBy: { sortOrder: "asc" as const }, select: { id: true, url: true, sortOrder: true } },
  variants: { orderBy: { name: "asc" as const }, select: { id: true, name: true, sku: true, price: true, compareAtPrice: true, stock: true, weightGrams: true, isActive: true, outOfStock: true } },
};

export async function GET(req: NextRequest) {
  try {
    const auth = requireAdmin(req);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("category") ?? undefined;
    const active = searchParams.get("active");
    const isActive = active === "true" ? true : active === "false" ? false : undefined;

    const where: { categoryId?: string; isActive?: boolean } = {};
    if (categoryId) where.categoryId = categoryId;
    if (isActive !== undefined) where.isActive = isActive;

    const products = await prisma.product.findMany({ where, orderBy: [{ sortOrder: "asc" }, { name: "asc" }], include: productInclude });
    return NextResponse.json({ products });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = requireAdmin(req);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
    const body = (await req.json()) as { name?: string; slug?: string; categoryId?: string; description?: string; shortDescription?: string; ingredients?: string | null; nutrition?: unknown; cardLabel?: string | null; isActive?: boolean; sortOrder?: number };

    const name = typeof body.name === "string" ? body.name.trim() : undefined;
    const slug = typeof body.slug === "string" ? body.slug.trim().toLowerCase().replace(/\s+/g, "-") : undefined;
    const categoryId = typeof body.categoryId === "string" ? body.categoryId.trim() : undefined;
    const description = typeof body.description === "string" ? body.description.trim() : "";
    const shortDescription = typeof body.shortDescription === "string" ? body.shortDescription.trim() || null : null;
    const ingredients = typeof body.ingredients === "string" ? body.ingredients.trim() || null : null;
    const cardLabel = typeof body.cardLabel === "string" ? body.cardLabel.trim() || null : body.cardLabel === null ? null : undefined;
    const nutrition = Array.isArray(body.nutrition) ? (body.nutrition.map((row) => { if (!row || typeof row !== "object") return null; const r = row as { label?: unknown; value?: unknown }; const label = typeof r.label === "string" ? r.label.trim() : ""; const value = typeof r.value === "string" ? r.value.trim() : ""; if (!label || !value) return null; return { label, value }; }).filter(Boolean) as { label: string; value: string }[]) : undefined;
    const isActive = body.isActive !== false;
    const sortOrder = typeof body.sortOrder === "number" ? body.sortOrder : 0;

    if (!name || !slug || !categoryId) return NextResponse.json({ error: "name, slug, and categoryId are required." }, { status: 400 });

    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) return NextResponse.json({ error: "Category not found." }, { status: 400 });

    const product = await prisma.product.create({
      data: { name, slug, categoryId, description, shortDescription, ingredients, ...(cardLabel !== undefined ? { cardLabel } : {}), ...(nutrition !== undefined ? { nutrition: nutrition.length > 0 ? nutrition : Prisma.DbNull } : {}), isActive, sortOrder },
      include: productInclude,
    });
    return NextResponse.json({ product }, { status: 201 });
  } catch (e: unknown) {
    if (e && typeof e === "object" && "code" in e && (e as { code: string }).code === "P2002") return NextResponse.json({ error: "A product with this slug already exists." }, { status: 409 });
    console.error(e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
