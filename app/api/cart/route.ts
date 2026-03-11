import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { optionalAuth } from "@/lib/auth";
import { findCart, cartItemInclude, getOrCreateCart, formatCart, CART_COOKIE } from "@/lib/cart";

export async function GET(req: NextRequest) {
  try {
    const user = optionalAuth(req);
    const sessionId = req.cookies.get(CART_COOKIE)?.value ?? null;
    const cart = await findCart(user?.id ?? null, sessionId);
    if (!cart) return NextResponse.json({ cart: { id: null, items: [] } });
    return NextResponse.json(formatCart({ id: cart.id, items: (cart as unknown as { items: unknown[] }).items }));
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = optionalAuth(req);
    const body = (await req.json()) as { variantId?: string; quantity?: number };
    const variantId = typeof body.variantId === "string" ? body.variantId.trim() : undefined;
    const quantity = typeof body.quantity === "number" ? Math.max(1, Math.floor(body.quantity)) : 1;

    if (!variantId) return NextResponse.json({ error: "variantId is required." }, { status: 400 });

    const variant = await prisma.productVariant.findUnique({ where: { id: variantId, isActive: true } });
    if (!variant) return NextResponse.json({ error: "Variant not found." }, { status: 404 });

    let res: NextResponse = NextResponse.json({});
    const { id: cartId, response } = await getOrCreateCart(req, res, user?.id ?? null);
    res = response;

    const existing = await prisma.cartItem.findUnique({ where: { cartId_variantId: { cartId, variantId } } });
    if (existing) {
      await prisma.cartItem.update({ where: { id: existing.id }, data: { quantity: existing.quantity + quantity } });
    } else {
      await prisma.cartItem.create({ data: { cartId, variantId, quantity } });
    }

    const cart = await prisma.cart.findUnique({ where: { id: cartId }, include: { items: { include: cartItemInclude } } });
    if (!cart) return NextResponse.json({ error: "Something went wrong." }, { status: 500 });

    const body2 = formatCart({ id: cart.id, items: cart.items });
    const finalRes = NextResponse.json(body2);
    res.cookies.getAll().forEach((c) => finalRes.cookies.set(c.name, c.value, c));
    return finalRes;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
