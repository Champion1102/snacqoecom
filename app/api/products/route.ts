import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const productListSelect = {
  id: true, slug: true, name: true, shortDescription: true, cardLabel: true, sortOrder: true,
  category: { select: { id: true, name: true, slug: true } },
  images: { orderBy: { sortOrder: "asc" as const }, take: 5, select: { id: true, url: true, sortOrder: true } },
  variants: {
    where: { isActive: true },
    orderBy: { name: "asc" as const },
    select: { id: true, name: true, sku: true, price: true, compareAtPrice: true, stock: true, outOfStock: true },
  },
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get("category") ?? undefined;
    const sort = searchParams.get("sort") ?? undefined;

    const where: { isActive: boolean; category?: { slug: string } } = { isActive: true };
    if (categorySlug) where.category = { slug: categorySlug };

    type OrderBy = { sortOrder?: "asc"; name?: "asc" | "desc" };
    let orderBy: OrderBy = { sortOrder: "asc" };
    if (sort === "price-asc" || sort === "name") orderBy = { name: "asc" };
    else if (sort === "price-desc") orderBy = { name: "desc" };

    const products = await prisma.product.findMany({ where, orderBy, select: productListSelect });
    return NextResponse.json({ products });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
