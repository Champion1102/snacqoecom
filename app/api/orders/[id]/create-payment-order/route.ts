import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { prisma } from "@/lib/prisma";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!razorpayKeyId || !razorpayKeySecret) return NextResponse.json({ error: "Payment is not configured." }, { status: 503 });

    const { id: orderId } = await params;
    if (!orderId) return NextResponse.json({ error: "Order ID is required." }, { status: 400 });

    const order = await prisma.order.findUnique({ where: { id: orderId }, select: { id: true, orderNumber: true, total: true, currency: true, status: true } });
    if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });
    if (order.status !== "PENDING") return NextResponse.json({ error: "Order is not pending payment." }, { status: 400 });

    const razorpay = new Razorpay({ key_id: razorpayKeyId, key_secret: razorpayKeySecret });
    const rzpOrder = await new Promise<{ id: string }>((resolve, reject) => {
      razorpay.orders.create({ amount: order.total, currency: order.currency, receipt: order.orderNumber }, (err, data) => {
        if (err) reject(err);
        else resolve(data as { id: string });
      });
    });

    await prisma.order.update({ where: { id: orderId }, data: { razorpayOrderId: rzpOrder.id } });
    return NextResponse.json({ razorpayOrderId: rzpOrder.id, key: razorpayKeyId, amount: order.total, currency: order.currency });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Could not create payment order." }, { status: 500 });
  }
}
