import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; imgId: string }> }
) {
  try {
    const auth = requireAdmin(req);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
    const { id: productId, imgId } = await params;
    const body = (await req.json()) as { sortOrder?: number };
    const sortOrder = typeof body.sortOrder === "number" ? body.sortOrder : undefined;
    if (sortOrder === undefined) return NextResponse.json({ error: "sortOrder is required." }, { status: 400 });

    const image = await prisma.productImage.findFirst({ where: { id: imgId, productId } });
    if (!image) return NextResponse.json({ error: "Image not found." }, { status: 404 });

    const updated = await prisma.productImage.update({ where: { id: imgId }, data: { sortOrder } });
    return NextResponse.json({ image: updated });
  } catch (e: unknown) {
    if (e && typeof e === "object" && "code" in e && (e as { code: string }).code === "P2025") return NextResponse.json({ error: "Image not found." }, { status: 404 });
    console.error(e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; imgId: string }> }
) {
  try {
    const auth = requireAdmin(req);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
    const { id: productId, imgId } = await params;

    const image = await prisma.productImage.findFirst({ where: { id: imgId, productId } });
    if (!image) return NextResponse.json({ error: "Image not found." }, { status: 404 });

    await prisma.productImage.delete({ where: { id: imgId } });
    return new NextResponse(null, { status: 204 });
  } catch (e: unknown) {
    if (e && typeof e === "object" && "code" in e && (e as { code: string }).code === "P2025") return NextResponse.json({ error: "Image not found." }, { status: 404 });
    console.error(e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
