import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { uploadImage, uploadVideo } from "@/services/cloudinary";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAuth(req);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
    const { id: orderId } = await params;

    const order = await prisma.order.findFirst({ where: { id: orderId, userId: auth.user.id, status: "DELIVERED" }, select: { id: true } });
    if (!order) return NextResponse.json({ error: "Order not found or not delivered." }, { status: 404 });

    const review = await prisma.orderReview.findUnique({
      where: { orderId },
      select: { id: true, rating: true, text: true, imageUrls: true, videoUrl: true, reviewerFirstName: true, reviewerLastName: true, createdAt: true },
    });
    return NextResponse.json({ review: review ?? null });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAuth(req);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
    const { id: orderId } = await params;

    const order = await prisma.order.findFirst({ where: { id: orderId, userId: auth.user.id, status: "DELIVERED" }, select: { id: true } });
    if (!order) return NextResponse.json({ error: "Order not found or not delivered." }, { status: 404 });

    const existing = await prisma.orderReview.findUnique({ where: { orderId } });
    if (existing) return NextResponse.json({ error: "You have already submitted a review for this order." }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { id: auth.user.id }, select: { firstName: true, lastName: true } });

    const formData = await req.formData();
    const text = formData.get("text");
    const ratingRaw = formData.get("rating");
    const textStr = typeof text === "string" ? text.trim() : null;
    const parsed = ratingRaw !== null && ratingRaw !== "" ? parseInt(String(ratingRaw), 10) : NaN;
    const ratingNum = Number.isNaN(parsed) ? null : Math.min(5, Math.max(1, parsed));

    const imageFiles = formData.getAll("images") as File[];
    const videoFile = formData.get("video") as File | null;

    const imageUrls: string[] = [];
    for (const file of imageFiles) {
      if (file instanceof File && /^image\//i.test(file.type)) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const { url } = await uploadImage(buffer, { folder: "snacqo/reviews" });
        imageUrls.push(url);
      }
    }

    let videoUrl: string | null = null;
    if (videoFile instanceof File && /^video\//i.test(videoFile.type)) {
      const buffer = Buffer.from(await videoFile.arrayBuffer());
      const { url } = await uploadVideo(buffer, { folder: "snacqo/reviews" });
      videoUrl = url;
    }

    await prisma.orderReview.create({
      data: { orderId, userId: auth.user.id, reviewerFirstName: user?.firstName ?? null, reviewerLastName: user?.lastName ?? null, rating: ratingNum, text: textStr || null, imageUrls, videoUrl },
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed to submit review." }, { status: 500 });
  }
}
