import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; vid: string }> }
) {
  try {
    const auth = requireAdmin(req);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
    const { id: productId, vid } = await params;
    const body = (await req.json()) as Record<string, unknown>;
    const data: Record<string, unknown> = {};
    if (typeof body.name === "string") data.name = body.name.trim();
    if (typeof body.sku === "string") data.sku = body.sku.trim().toUpperCase();
    if (typeof body.price === "number") data.price = Math.max(0, Math.floor(body.price));
    if (body.compareAtPrice !== undefined) data.compareAtPrice = body.compareAtPrice == null ? null : Math.max(0, Math.floor(Number(body.compareAtPrice)));
    if (typeof body.stock === "number") data.stock = Math.max(0, Math.floor(body.stock));
    if (body.weightGrams !== undefined) data.weightGrams = body.weightGrams == null ? null : Math.max(0, Math.floor(Number(body.weightGrams)));
    if (typeof body.isActive === "boolean") data.isActive = body.isActive;
    if (typeof body.outOfStock === "boolean") data.outOfStock = body.outOfStock;

    if (Object.keys(data).length === 0) return NextResponse.json({ error: "No valid fields to update." }, { status: 400 });

    const variant = await prisma.productVariant.findFirst({ where: { id: vid, productId } });
    if (!variant) return NextResponse.json({ error: "Variant not found." }, { status: 404 });

    const updated = await prisma.productVariant.update({ where: { id: vid }, data });
    return NextResponse.json({ variant: updated });
  } catch (e: unknown) {
    if (e && typeof e === "object" && "code" in e) {
      const code = (e as { code: string }).code;
      if (code === "P2025") return NextResponse.json({ error: "Variant not found." }, { status: 404 });
      if (code === "P2002") return NextResponse.json({ error: "SKU already exists." }, { status: 409 });
    }
    console.error(e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; vid: string }> }
) {
  try {
    const auth = requireAdmin(req);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
    const { id: productId, vid } = await params;

    const variant = await prisma.productVariant.findFirst({ where: { id: vid, productId }, include: { _count: { select: { cartItems: true, orderItems: true } } } });
    if (!variant) return NextResponse.json({ error: "Variant not found." }, { status: 404 });
    if (variant._count.cartItems > 0 || variant._count.orderItems > 0) return NextResponse.json({ error: "Cannot delete variant that is in cart or orders. Deactivate it instead." }, { status: 400 });

    await prisma.productVariant.delete({ where: { id: vid } });
    return new NextResponse(null, { status: 204 });
  } catch (e: unknown) {
    if (e && typeof e === "object" && "code" in e && (e as { code: string }).code === "P2025") return NextResponse.json({ error: "Variant not found." }, { status: 404 });
    console.error(e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
