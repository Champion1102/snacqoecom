import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import type { OrderStatus } from "@prisma/client";

const ORDER_STATUSES: OrderStatus[] = ["PENDING", "PROCESSING", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];

export async function GET(req: NextRequest) {
  try {
    const auth = requireAdmin(req);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status")?.trim().toUpperCase();
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10) || 20));
    const skip = (page - 1) * limit;

    const where = status && ORDER_STATUSES.includes(status as OrderStatus) ? { status: status as OrderStatus } : {};

    const [orders, total] = await Promise.all([
      prisma.order.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: limit, select: { id: true, orderNumber: true, email: true, status: true, total: true, currency: true, createdAt: true, _count: { select: { items: true } } } }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({ orders, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
