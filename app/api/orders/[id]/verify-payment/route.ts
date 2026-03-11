import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { prisma } from "@/lib/prisma";

const orderInclude = {
  items: { include: { variant: { select: { id: true, name: true, sku: true, price: true, product: { select: { id: true, slug: true, name: true, images: { orderBy: { sortOrder: "asc" as const }, take: 1, select: { url: true } } } } } } } },
  campus: { select: { id: true, name: true, line1: true, city: true, state: true, pincode: true } },
};

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!razorpayKeySecret || !razorpayKeyId) return NextResponse.json({ error: "Payment is not configured." }, { status: 503 });

    const { id: orderId } = await params;
    const body = (await req.json()) as { razorpay_payment_id?: string; razorpay_order_id?: string; razorpay_signature?: string };

    const razorpayPaymentId = typeof body.razorpay_payment_id === "string" ? body.razorpay_payment_id.trim() : undefined;
    const razorpayOrderId = typeof body.razorpay_order_id === "string" ? body.razorpay_order_id.trim() : undefined;
    const razorpaySignature = typeof body.razorpay_signature === "string" ? body.razorpay_signature.trim() : undefined;

    if (!orderId || !razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
      return NextResponse.json({ error: "Missing payment verification details." }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { id: orderId }, select: { id: true, status: true } });
    if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });
    if (order.status !== "PENDING") return NextResponse.json({ error: "Order is not pending payment." }, { status: 400 });

    const expectedSignature = crypto.createHmac("sha256", razorpayKeySecret).update(`${razorpayOrderId}|${razorpayPaymentId}`).digest("hex");
    if (expectedSignature !== razorpaySignature) return NextResponse.json({ error: "Invalid payment signature." }, { status: 400 });

    const razorpay = new Razorpay({ key_id: razorpayKeyId, key_secret: razorpayKeySecret });
    const payment = await razorpay.payments.fetch(razorpayPaymentId);
    const razorpayPaymentStatus = payment.status as string;

    await prisma.order.update({
      where: { id: orderId },
      data: { status: razorpayPaymentStatus === "captured" ? "PROCESSING" : "PENDING", razorpayOrderId, razorpayPaymentId, razorpaySignature, razorpayPaymentStatus },
    });

    const orderWithItems = await prisma.order.findUnique({ where: { id: orderId }, include: orderInclude });
    return NextResponse.json({ success: true, order: orderWithItems });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Payment verification failed." }, { status: 500 });
  }
}
