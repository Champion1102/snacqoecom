import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) return NextResponse.json({ error: "Product slug is required." }, { status: 400 });

    const product = await prisma.product.findUnique({ where: { slug, isActive: true }, select: { id: true } });
    if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });

    const reviews = await prisma.orderReview.findMany({
      where: { order: { items: { some: { variant: { productId: product.id } } } } },
      orderBy: { createdAt: "desc" },
      select: {
        id: true, rating: true, text: true, imageUrls: true, videoUrl: true,
        reviewerFirstName: true, reviewerLastName: true, createdAt: true,
      },
    });
    return NextResponse.json({ reviews });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
