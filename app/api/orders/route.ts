import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { optionalAuth, requireAuth } from "@/lib/auth";
import { findCart, CART_COOKIE } from "@/lib/cart";
import { formatDateTimeIST } from "@/utils/date";

const FREE_SHIPPING_THRESHOLD_PAISE = 49_900;
const SHIPPING_LOW_THRESHOLD_PAISE = 20_000;
const SHIPPING_BELOW_200_PAISE = 5_000;
const SHIPPING_200_TO_499_PAISE = 10_000;

function getStandardShippingPaise(subtotalPaise: number): number {
  if (subtotalPaise >= FREE_SHIPPING_THRESHOLD_PAISE) return 0;
  if (subtotalPaise < SHIPPING_LOW_THRESHOLD_PAISE) return SHIPPING_BELOW_200_PAISE;
  return SHIPPING_200_TO_499_PAISE;
}

function generateOrderNumber(): string {
  const part = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SNQ-${part}-${rand}`;
}

async function validateCoupon(
  code: string, subtotalPaise: number,
  options: { isCampusOrder?: boolean; campusId?: string | null } = {}
): Promise<{ valid: true; discountAmount: number; freeShipping: boolean } | { valid: false; message: string }> {
  const { isCampusOrder = false, campusId = null } = options;
  const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
  if (!coupon || !coupon.isActive) return { valid: false, message: "Invalid or inactive coupon." };
  const now = new Date();
  if (now < coupon.validFrom) return { valid: false, message: `Coupon not yet valid. Valid from ${formatDateTimeIST(coupon.validFrom)}.` };
  if (now > coupon.validTo) return { valid: false, message: `Coupon has expired. It was valid until ${formatDateTimeIST(coupon.validTo)}.` };
  if (coupon.minOrderAmount != null && subtotalPaise < coupon.minOrderAmount) return { valid: false, message: "Minimum order amount not met." };
  if (coupon.maxUses != null && coupon.usedCount >= coupon.maxUses) return { valid: false, message: "Coupon usage limit reached." };
  if (coupon.campusOnly) {
    if (!isCampusOrder) return { valid: false, message: "This coupon is only valid for campus delivery orders." };
    const allowedIds = coupon.allowedCampusIds ?? [];
    if (allowedIds.length > 0 && (!campusId || !allowedIds.includes(campusId))) return { valid: false, message: "This coupon is not valid for the selected campus." };
  }
  const freeShipping = coupon.type === "FREE_SHIPPING";
  const discountAmount = freeShipping ? 0 : coupon.type === "PERCENT" ? Math.floor((subtotalPaise * coupon.value) / 100) : Math.min(coupon.value, subtotalPaise);
  return { valid: true, discountAmount, freeShipping };
}

const orderInclude = {
  items: { include: { variant: { select: { id: true, name: true, sku: true, price: true, product: { select: { id: true, slug: true, name: true, images: { orderBy: { sortOrder: "asc" as const }, take: 1, select: { url: true } } } } } } } },
  campus: { select: { id: true, name: true, line1: true, city: true, state: true, pincode: true } },
};

export async function POST(req: NextRequest) {
  try {
    const user = optionalAuth(req);
    const sessionId = req.cookies.get(CART_COOKIE)?.value ?? null;
    const cart = await findCart(user?.id ?? null, sessionId);

    if (!cart || !(cart as unknown as { items: unknown[] }).items.length) {
      return NextResponse.json({ error: "Cart is empty. Add items before placing an order." }, { status: 400 });
    }

    const body = (await req.json()) as {
      email?: string; deliveryType?: string; campusId?: string;
      shippingName?: string; shippingPhone?: string; shippingLine1?: string;
      shippingLine2?: string; shippingCity?: string; shippingState?: string;
      shippingPincode?: string; couponCode?: string; couponCodes?: string[];
    };

    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : undefined;
    const deliveryTypeRaw = typeof body.deliveryType === "string" ? body.deliveryType.trim().toUpperCase() : "STANDARD";
    const deliveryType = deliveryTypeRaw === "CAMPUS" ? "CAMPUS" : "STANDARD";
    const campusId = typeof body.campusId === "string" ? body.campusId.trim() || null : null;
    const shippingName = typeof body.shippingName === "string" ? body.shippingName.trim() : undefined;
    const shippingPhone = typeof body.shippingPhone === "string" ? body.shippingPhone.trim() : undefined;
    const shippingLine1 = typeof body.shippingLine1 === "string" ? body.shippingLine1.trim() : undefined;
    const shippingLine2 = typeof body.shippingLine2 === "string" ? body.shippingLine2.trim() : null;
    const shippingCity = typeof body.shippingCity === "string" ? body.shippingCity.trim() : undefined;
    const shippingState = typeof body.shippingState === "string" ? body.shippingState.trim() : undefined;
    const shippingPincode = typeof body.shippingPincode === "string" ? body.shippingPincode.trim() : undefined;
    const couponCodesRaw = Array.isArray(body.couponCodes) ? body.couponCodes : [];
    const couponCodeSingle = typeof body.couponCode === "string" ? body.couponCode.trim() : undefined;
    const couponCodes = couponCodesRaw.length > 0 ? couponCodesRaw.map((c) => (typeof c === "string" ? c.trim() : "")).filter(Boolean) : couponCodeSingle ? [couponCodeSingle] : [];

    if (!email) return NextResponse.json({ error: "Email is required." }, { status: 400 });
    if (deliveryType === "CAMPUS" && !campusId) return NextResponse.json({ error: "Campus is required for campus delivery." }, { status: 400 });

    const isCampusOrder = Boolean(deliveryType === "CAMPUS" && campusId);
    let finalName: string, finalPhone: string, finalLine1: string, finalLine2: string | null, finalCity: string, finalState: string, finalPincode: string;

    if (isCampusOrder && campusId) {
      const campus = await prisma.campus.findFirst({ where: { id: campusId, isActive: true } });
      if (!campus) return NextResponse.json({ error: "Invalid or inactive campus selected." }, { status: 400 });
      if (!shippingName || !shippingPhone) return NextResponse.json({ error: "Name and phone are required for campus delivery." }, { status: 400 });
      finalName = shippingName; finalPhone = shippingPhone; finalLine1 = campus.line1; finalLine2 = campus.line2; finalCity = campus.city; finalState = campus.state; finalPincode = campus.pincode;
    } else {
      if (!shippingName || !shippingPhone || !shippingLine1 || !shippingCity || !shippingState || !shippingPincode) {
        return NextResponse.json({ error: "Missing required fields: email, shippingName, shippingPhone, shippingLine1, shippingCity, shippingState, shippingPincode." }, { status: 400 });
      }
      finalName = shippingName; finalPhone = shippingPhone; finalLine1 = shippingLine1; finalLine2 = shippingLine2; finalCity = shippingCity; finalState = shippingState; finalPincode = shippingPincode;
    }

    const items = (cart as unknown as { items: Array<{ variantId: string; quantity: number; variant: { price: number; product: { name: string }; name: string } }> }).items;
    let subtotal = 0;
    for (const item of items) subtotal += item.variant.price * item.quantity;

    const settingRow = await prisma.setting.findUnique({ where: { key: "allow_multiple_coupons" } });
    const allowMultipleCoupons = settingRow?.value === "true";

    if (couponCodes.length > 1 && !allowMultipleCoupons) return NextResponse.json({ error: "Multiple coupon codes are not allowed." }, { status: 400 });

    const codesToApply = allowMultipleCoupons ? [...new Set(couponCodes.map((c) => c.toUpperCase()))] : couponCodes.length > 0 ? [couponCodes[0].toUpperCase()] : [];

    let discountAmount = 0, freeShipping = false;
    for (const code of codesToApply) {
      const result = await validateCoupon(code, subtotal, { isCampusOrder, campusId });
      if (!result.valid) return NextResponse.json({ error: result.message }, { status: 400 });
      discountAmount += result.discountAmount;
      freeShipping = freeShipping || result.freeShipping;
    }

    const shippingAmount = freeShipping || isCampusOrder ? 0 : getStandardShippingPaise(subtotal);
    const total = Math.max(0, subtotal - discountAmount + shippingAmount);
    const orderNumber = generateOrderNumber();
    const couponCodeStored = codesToApply.length > 0 ? codesToApply.join(",") : undefined;

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: { orderNumber, userId: user?.id, email, status: "PENDING", deliveryType: deliveryType as "STANDARD" | "CAMPUS", campusId: isCampusOrder ? campusId : undefined, subtotal, shippingAmount, discountAmount, total, currency: "INR", couponCode: couponCodeStored, shippingName: finalName, shippingPhone: finalPhone, shippingLine1: finalLine1, shippingLine2: finalLine2, shippingCity: finalCity, shippingState: finalState, shippingPincode: finalPincode },
      });
      for (const item of items) {
        await tx.orderItem.create({ data: { orderId: newOrder.id, variantId: item.variantId, productName: item.variant.product.name, variantName: item.variant.name, quantity: item.quantity, price: item.variant.price, total: item.variant.price * item.quantity } });
      }
      for (const code of codesToApply) await tx.coupon.update({ where: { code }, data: { usedCount: { increment: 1 } } });
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      return newOrder;
    });

    const orderWithItems = await prisma.order.findUnique({ where: { id: order.id }, include: orderInclude });
    return NextResponse.json({ order: orderWithItems, razorpayOrderId: null }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const orders = await prisma.order.findMany({
      where: { userId: auth.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true, orderNumber: true, status: true, total: true, currency: true, createdAt: true,
        _count: { select: { items: true } },
        items: { select: { id: true, quantity: true, productName: true, variantName: true, variant: { select: { id: true, name: true, product: { select: { id: true, slug: true, name: true, images: { orderBy: { sortOrder: "asc" as const }, take: 1, select: { url: true } } } } } } } },
        review: { select: { id: true } },
      },
    });
    return NextResponse.json({ orders });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
