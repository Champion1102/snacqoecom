import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { optionalAuth } from "@/lib/auth";

const orderInclude = {
  items: { include: { variant: { select: { id: true, name: true, sku: true, price: true, product: { select: { id: true, slug: true, name: true, images: { orderBy: { sortOrder: "asc" as const }, take: 1, select: { url: true } } } } } } } },
  campus: { select: { id: true, name: true, line1: true, city: true, state: true, pincode: true } },
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = optionalAuth(req);
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email")?.trim().toLowerCase();
    const orderNumber = searchParams.get("orderNumber")?.trim();

    const order = await prisma.order.findUnique({ where: { id }, include: orderInclude });
    if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });

    const isOwner = user && order.userId === user.id;
    const isGuestLookup = email && orderNumber && order.email === email && order.orderNumber === orderNumber;

    if (!isOwner && !isGuestLookup) return NextResponse.json({ error: "Order not found." }, { status: 404 });

    return NextResponse.json({ order });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;
    const user = optionalAuth(req);
    const sessionId = req.cookies.get("cart_session")?.value ?? null;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true, status: true, couponCode: true, items: { select: { variantId: true, quantity: true } } },
    });
    if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });
    if (order.status !== "PENDING") return NextResponse.json({ error: "Only pending orders can be cancelled." }, { status: 400 });

    let cartId: string;
    const existingCart = await (async () => {
      if (user?.id) return prisma.cart.findFirst({ where: { userId: user.id } });
      if (sessionId) return prisma.cart.findFirst({ where: { sessionId } });
      return null;
    })();

    if (existingCart) {
      cartId = existingCart.id;
    } else {
      const { randomUUID } = await import("crypto");
      const newSessionId = sessionId ?? randomUUID();
      const newCart = await prisma.cart.create({ data: { userId: user?.id, sessionId: user?.id ? undefined : newSessionId } });
      cartId = newCart.id;
    }

    await prisma.$transaction(async (tx) => {
      for (const item of order.items as Array<{ variantId: string; quantity: number }>) {
        const existing = await tx.cartItem.findUnique({ where: { cartId_variantId: { cartId, variantId: item.variantId } } });
        if (existing) {
          await tx.cartItem.update({ where: { id: existing.id }, data: { quantity: existing.quantity + item.quantity } });
        } else {
          await tx.cartItem.create({ data: { cartId, variantId: item.variantId, quantity: item.quantity } });
        }
      }
      if (order.couponCode) {
        const codes = (order.couponCode as string).split(",").map((c: string) => c.trim().toUpperCase()).filter(Boolean);
        for (const code of codes) await tx.coupon.updateMany({ where: { code }, data: { usedCount: { decrement: 1 } } });
      }
      await tx.order.delete({ where: { id: orderId } });
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Could not cancel order." }, { status: 500 });
  }
}
