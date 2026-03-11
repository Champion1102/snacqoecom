import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import type { OrderStatus } from "@prisma/client";

const ORDER_STATUSES: OrderStatus[] = ["PENDING", "PROCESSING", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];

const orderInclude = {
  items: { include: { variant: { select: { id: true, name: true, sku: true, price: true, product: { select: { id: true, slug: true, name: true } } } } } },
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAdmin(req);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
    const { id } = await params;
    const order = await prisma.order.findUnique({ where: { id }, include: orderInclude });
    if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });
    return NextResponse.json({ order });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAdmin(req);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
    const { id } = await params;
    const body = (await req.json()) as { status?: string };
    const status = typeof body.status === "string" ? body.status.trim().toUpperCase() : undefined;

    if (!status || !ORDER_STATUSES.includes(status as OrderStatus)) {
      return NextResponse.json({ error: "Valid status is required: " + ORDER_STATUSES.join(", ") }, { status: 400 });
    }

    const order = await prisma.order.update({ where: { id }, data: { status: status as OrderStatus }, include: orderInclude });
    return NextResponse.json({ order });
  } catch (e: unknown) {
    if (e && typeof e === "object" && "code" in e && (e as { code: string }).code === "P2025") return NextResponse.json({ error: "Order not found." }, { status: 404 });
    console.error(e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
