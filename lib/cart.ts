import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";

export const CART_COOKIE = "cart_session";
export const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export const cartItemInclude = {
  variant: {
    select: {
      id: true,
      name: true,
      sku: true,
      price: true,
      compareAtPrice: true,
      product: {
        select: {
          id: true,
          slug: true,
          name: true,
          images: { orderBy: { sortOrder: "asc" as const }, take: 1, select: { url: true } },
        },
      },
    },
  },
} as const;

type PrismaType = typeof prisma;
type CartWithItems = Awaited<ReturnType<PrismaType["cart"]["findFirst"]>>;

/** Session wins: replace user cart contents with session cart, then remove session cart. */
async function replaceUserCartWithSessionCart(
  userCart: NonNullable<CartWithItems>,
  sessionCart: NonNullable<CartWithItems>
) {
  const sessionItems = (sessionCart as unknown as { items: Array<{ variantId: string; quantity: number }> }).items;
  if (sessionItems.length === 0) return userCart;

  await prisma.$transaction(async (tx) => {
    await tx.cartItem.deleteMany({ where: { cartId: userCart.id } });
    for (const item of sessionItems) {
      await tx.cartItem.create({
        data: { cartId: userCart.id, variantId: item.variantId, quantity: item.quantity },
      });
    }
    await tx.cartItem.deleteMany({ where: { cartId: sessionCart.id } });
    try {
      await tx.cart.delete({ where: { id: sessionCart.id } });
    } catch (e) {
      if (e && typeof e === "object" && "code" in e && (e as { code: string }).code === "P2025") return;
      throw e;
    }
  });

  const replaced = await prisma.cart.findFirst({
    where: { id: userCart.id },
    include: { items: { include: cartItemInclude } },
  });
  return replaced;
}

type CartResult = Awaited<ReturnType<typeof prisma.cart.findFirst<{ include: { items: { include: typeof cartItemInclude } } }>>>;

export async function findCart(userId: string | null, sessionId: string | null) {
  let byUser: CartResult = null;
  let bySession: CartResult = null;

  if (userId) {
    byUser = await prisma.cart.findFirst({ where: { userId }, include: { items: { include: cartItemInclude } } });
  }
  if (sessionId) {
    bySession = await prisma.cart.findFirst({ where: { sessionId }, include: { items: { include: cartItemInclude } } });
  }

  if (userId && bySession && (bySession as unknown as { items: unknown[] }).items.length > 0) {
    if (byUser && byUser.id !== bySession.id) {
      return replaceUserCartWithSessionCart(byUser as NonNullable<CartWithItems>, bySession as NonNullable<CartWithItems>);
    }
    if (!byUser) {
      await prisma.cart.update({ where: { id: bySession.id }, data: { userId, sessionId: null } });
      return prisma.cart.findFirst({ where: { id: bySession.id }, include: { items: { include: cartItemInclude } } });
    }
  }

  if (byUser) return byUser;
  if (bySession) return bySession;
  return null;
}

export async function getOrCreateCart(
  req: NextRequest,
  res: NextResponse,
  userId: string | null
): Promise<{ id: string; items: unknown[]; response: NextResponse }> {
  const sessionId = req.cookies.get(CART_COOKIE)?.value ?? null;
  let cart = await findCart(userId, sessionId);

  if (cart) {
    return { id: cart.id, items: (cart as unknown as { items: unknown[] }).items, response: res };
  }

  const newSessionId = sessionId ?? randomUUID();
  cart = await prisma.cart.create({
    data: { userId: userId ?? undefined, sessionId: userId ? undefined : newSessionId },
    include: { items: { include: cartItemInclude } },
  });

  if (!userId) {
    res.cookies.set(CART_COOKIE, newSessionId, {
      httpOnly: true,
      maxAge: CART_COOKIE_MAX_AGE,
      sameSite: "none",
      secure: true,
      path: "/",
    });
  }

  return { id: cart.id, items: (cart as unknown as { items: unknown[] }).items, response: res };
}

export function formatCart(cart: { id: string; items: unknown[] }) {
  return { cart: { id: cart.id, items: cart.items } };
}
