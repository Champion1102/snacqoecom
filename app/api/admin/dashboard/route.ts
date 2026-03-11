import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const auth = requireAdmin(req);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const startOfLast30Days = new Date(startOfToday);
    startOfLast30Days.setDate(startOfLast30Days.getDate() - 30);

    const [ordersToday, ordersThisWeek, revenueToday, revenueThisWeek, totalOrders, deliveredCount, cancelledCount, lowStockVariants, activeProducts, activeCoupons, ordersLast30Days, itemsWithOrderId] = await Promise.all([
      prisma.order.count({ where: { createdAt: { gte: startOfToday } } }),
      prisma.order.count({ where: { createdAt: { gte: startOfWeek } } }),
      prisma.order.aggregate({ where: { createdAt: { gte: startOfToday }, razorpayPaymentStatus: "captured" }, _sum: { total: true } }),
      prisma.order.aggregate({ where: { createdAt: { gte: startOfWeek }, razorpayPaymentStatus: "captured" }, _sum: { total: true } }),
      prisma.order.count(),
      prisma.order.count({ where: { status: "DELIVERED" } }),
      prisma.order.count({ where: { status: "CANCELLED" } }),
      prisma.productVariant.findMany({ where: { isActive: true, OR: [{ stock: { lte: 5 } }, { outOfStock: true }] }, select: { id: true, name: true, sku: true, stock: true, outOfStock: true, product: { select: { id: true, name: true, slug: true } } } }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.coupon.count({ where: { isActive: true } }),
      prisma.order.findMany({ where: { createdAt: { gte: startOfLast30Days } }, select: { createdAt: true, total: true, razorpayPaymentStatus: true } }),
      prisma.orderItem.findMany({ where: { order: { status: "DELIVERED" } }, select: { orderId: true, quantity: true, variant: { select: { productId: true, product: { select: { id: true, name: true } } } } } }),
    ]);

    const productMap = new Map<string, { productId: string; productName: string; quantitySold: number; orderIds: Set<string> }>();
    for (const item of itemsWithOrderId) {
      const productId = item.variant.product.id;
      const productName = item.variant.product.name;
      if (!productMap.has(productId)) productMap.set(productId, { productId, productName, quantitySold: 0, orderIds: new Set() });
      const rec = productMap.get(productId)!;
      rec.quantitySold += item.quantity;
      rec.orderIds.add(item.orderId);
    }
    const productWiseOrders = Array.from(productMap.values()).map((rec) => ({ productId: rec.productId, productName: rec.productName, quantitySold: rec.quantitySold, orderCount: rec.orderIds.size })).sort((a, b) => b.quantitySold - a.quantitySold).slice(0, 10);

    const ordersByDay: { date: string; orders: number; revenuePaise: number }[] = [];
    for (let d = 29; d >= 0; d--) {
      const day = new Date(startOfToday);
      day.setDate(day.getDate() - d);
      const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate());
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);
      const dayOrders = ordersLast30Days.filter((o: { createdAt: Date; total: number; razorpayPaymentStatus: string | null }) => o.createdAt >= dayStart && o.createdAt < dayEnd);
      const dayRevenue = dayOrders.filter((o: { createdAt: Date; total: number; razorpayPaymentStatus: string | null }) => o.razorpayPaymentStatus === "captured").reduce((sum: number, o: { total: number }) => sum + o.total, 0);
      ordersByDay.push({ date: dayStart.toISOString().slice(0, 10), orders: dayOrders.length, revenuePaise: dayRevenue });
    }

    const [pending, processing, shipped, outForDelivery, delivered, cancelled] = await Promise.all([
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.count({ where: { status: "PROCESSING" } }),
      prisma.order.count({ where: { status: "SHIPPED" } }),
      prisma.order.count({ where: { status: "OUT_FOR_DELIVERY" } }),
      prisma.order.count({ where: { status: "DELIVERED" } }),
      prisma.order.count({ where: { status: "CANCELLED" } }),
    ]);
    const ordersByStatus = [
      { name: "Pending", value: pending, status: "PENDING" },
      { name: "Processing", value: processing, status: "PROCESSING" },
      { name: "Shipped", value: shipped, status: "SHIPPED" },
      { name: "Out for delivery", value: outForDelivery, status: "OUT_FOR_DELIVERY" },
      { name: "Delivered", value: delivered, status: "DELIVERED" },
      { name: "Cancelled", value: cancelled, status: "CANCELLED" },
    ].filter((s) => s.value > 0);

    return NextResponse.json({
      orders: { today: ordersToday, thisWeek: ordersThisWeek, total: totalOrders, delivered: deliveredCount, cancelled: cancelledCount },
      revenue: { todayPaise: revenueToday._sum?.total ?? 0, thisWeekPaise: revenueThisWeek._sum?.total ?? 0 },
      lowStock: lowStockVariants,
      counts: { activeProducts, activeCoupons },
      productWiseOrders,
      ordersByDay,
      ordersByStatus,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
