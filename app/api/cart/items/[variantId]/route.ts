import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { optionalAuth } from "@/lib/auth";
import { findCart, cartItemInclude, CART_COOKIE, formatCart } from "@/lib/cart";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ variantId: string }> }
) {
  try {
    const { variantId } = await params;
    const user = optionalAuth(req);
    const body = (await req.json()) as { quantity?: number };
    const quantity = typeof body.quantity === "number" ? Math.max(0, Math.floor(body.quantity)) : undefined;

    if (!variantId) return NextResponse.json({ error: "variantId is required." }, { status: 400 });

    const sessionId = req.cookies.get(CART_COOKIE)?.value ?? null;
    const cart = await findCart(user?.id ?? null, sessionId);
    if (!cart) return NextResponse.json({ cart: { id: null, items: [] } });

    const line = await prisma.cartItem.findUnique({
      where: { cartId_variantId: { cartId: cart.id, variantId } },
    });
    if (!line) return NextResponse.json({ error: "Item not in cart." }, { status: 404 });

    if (quantity === 0) {
      await prisma.cartItem.delete({ where: { id: line.id } });
    } else if (quantity !== undefined) {
      await prisma.cartItem.update({ where: { id: line.id }, data: { quantity } });
    }

    const updated = await prisma.cart.findUnique({ where: { id: cart.id }, include: { items: { include: cartItemInclude } } });
    return NextResponse.json(formatCart({ id: updated!.id, items: updated!.items }));
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ variantId: string }> }
) {
  try {
    const { variantId } = await params;
    const user = optionalAuth(req);

    if (!variantId) return NextResponse.json({ error: "variantId is required." }, { status: 400 });

    const sessionId = req.cookies.get(CART_COOKIE)?.value ?? null;
    const cart = await findCart(user?.id ?? null, sessionId);
    if (!cart) return NextResponse.json({ cart: { id: null, items: [] } });

    const line = await prisma.cartItem.findUnique({
      where: { cartId_variantId: { cartId: cart.id, variantId } },
    });
    if (line) await prisma.cartItem.delete({ where: { id: line.id } });

    const updated = await prisma.cart.findUnique({ where: { id: cart.id }, include: { items: { include: cartItemInclude } } });
    return NextResponse.json(formatCart({ id: updated!.id, items: updated!.items }));
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
