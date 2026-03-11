import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { uploadImage } from "@/services/cloudinary";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAdmin(req);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
    const { id: productId } = await params;

    const formData = await req.formData();
    const files = formData.getAll("images") as File[];
    if (!files.length) return NextResponse.json({ error: 'No image files provided. Use field name "images".' }, { status: 400 });

    const product = await prisma.product.findUnique({ where: { id: productId }, include: { images: { orderBy: { sortOrder: "desc" }, take: 1 } } });
    if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });

    let nextSortOrder = (product.images[0]?.sortOrder ?? -1) + 1;
    const created: { id: string; url: string; sortOrder: number }[] = [];

    for (const file of files) {
      if (!(file instanceof File)) continue;
      if (!/^image\/(jpeg|jpg|png|gif|webp)$/i.test(file.type)) continue;
      const buffer = Buffer.from(await file.arrayBuffer());
      const { url } = await uploadImage(buffer, { folder: "snacqo/products" });
      const img = await prisma.productImage.create({ data: { productId, url, sortOrder: nextSortOrder++ } });
      created.push({ id: img.id, url: img.url, sortOrder: img.sortOrder });
    }

    return NextResponse.json({ images: created }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e instanceof Error ? e.message : "Image upload failed." }, { status: 500 });
  }
}
