import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Product from "@/lib/db/models/product";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    await connectDB();
    const product = await Product.findOne({ slug, available: true }).lean();

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      slug: product.slug,
      name: product.name,
      tagline: product.tagline,
      category: product.category,
      image: product.image,
      volumes: product.volumes.map((v) => ({
        label: v.label,
        price: v.price,
        originalPrice: v.originalPrice,
      })),
      description: product.description,
      ingredients: product.ingredients,
      howToEnjoy: product.howToEnjoy,
      storage: product.storage,
      bestBefore: product.bestBefore,
      deliveryDetails: product.deliveryDetails,
      tags: product.tags,
    });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
