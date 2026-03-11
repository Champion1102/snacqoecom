import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) return NextResponse.json({ error: "Product slug is required." }, { status: 400 });

    const product = await prisma.product.findUnique({
      where: { slug, isActive: true },
      select: {
        id: true, slug: true, name: true, description: true, shortDescription: true,
        cardLabel: true, ingredients: true, nutrition: true, sortOrder: true,
        category: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { sortOrder: "asc" as const }, select: { id: true, url: true, sortOrder: true } },
        variants: {
          where: { isActive: true },
          orderBy: { name: "asc" as const },
          select: { id: true, name: true, sku: true, price: true, compareAtPrice: true, stock: true, weightGrams: true, outOfStock: true },
        },
      },
    });

    if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });
    return NextResponse.json({ product });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
