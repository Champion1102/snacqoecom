import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const productInclude = {
  category: { select: { id: true, name: true, slug: true } },
  images: { orderBy: { sortOrder: "asc" as const }, select: { id: true, url: true, sortOrder: true } },
  variants: { orderBy: { name: "asc" as const }, select: { id: true, name: true, sku: true, price: true, compareAtPrice: true, stock: true, weightGrams: true, isActive: true, outOfStock: true } },
};

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAdmin(req);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
    const { id: productId } = await params;
    const body = (await req.json()) as { name?: string; sku?: string; price?: number; compareAtPrice?: number | null; stock?: number; weightGrams?: number | null; outOfStock?: boolean };

    const name = typeof body.name === "string" ? body.name.trim() : undefined;
    const sku = typeof body.sku === "string" ? body.sku.trim().toUpperCase() : undefined;
    const price = typeof body.price === "number" ? Math.max(0, Math.floor(body.price)) : undefined;
    const compareAtPrice = body.compareAtPrice != null ? Math.max(0, Math.floor(Number(body.compareAtPrice))) : null;
    const stock = typeof body.stock === "number" ? Math.max(0, Math.floor(body.stock)) : 0;
    const weightGrams = body.weightGrams != null ? Math.max(0, Math.floor(Number(body.weightGrams))) : null;
    const outOfStock = body.outOfStock === true;

    if (!name || !sku || price === undefined) return NextResponse.json({ error: "name, sku, and price (paise) are required." }, { status: 400 });

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });

    const variant = await prisma.productVariant.create({ data: { productId, name, sku, price, compareAtPrice, stock, weightGrams, outOfStock } });
    const updated = await prisma.product.findUnique({ where: { id: productId }, include: productInclude });
    return NextResponse.json({ variant, product: updated }, { status: 201 });
  } catch (e: unknown) {
    if (e && typeof e === "object" && "code" in e && (e as { code: string }).code === "P2002") return NextResponse.json({ error: "SKU already exists." }, { status: 409 });
    console.error(e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
