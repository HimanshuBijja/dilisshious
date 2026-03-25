import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";

interface SyncProduct {
  _id: string;
  slug: string;
  name: string;
  tagline: string;
  category: string;
  image: string;
  cloudinaryUrl?: string;
  volumes: { label: string; price: number; originalPrice?: number }[];
  description: string;
  ingredients: string;
  howToEnjoy: string;
  storage: string;
  bestBefore: string;
  deliveryDetails: string;
  tags: string[];
  badge?: string;
  available: boolean;
}

export async function POST(request: NextRequest) {
  // Verify sync secret
  const syncSecret = request.headers.get("x-sync-secret");
  if (!syncSecret || syncSecret !== process.env.SYNC_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { products } = (await request.json()) as { products: SyncProduct[] };

    if (!products || !Array.isArray(products)) {
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 }
      );
    }

    const publicDir = path.join(process.cwd(), "public");
    const dataDir = path.join(publicDir, "data");

    // Ensure data directory exists
    fs.mkdirSync(dataDir, { recursive: true });

    // Use Cloudinary URLs directly as image sources — no local download needed.
    // This eliminates the filename mismatch between admin local paths and user site paths.
    let cloudinaryImageCount = 0;
    let fallbackImageCount = 0;

    for (const product of products) {
      if (product.cloudinaryUrl) {
        // Use the Cloudinary CDN URL directly — fast, reliable, no download step
        product.image = product.cloudinaryUrl;
        cloudinaryImageCount++;
      } else {
        // No Cloudinary URL available — keep the existing image path as-is
        // (this will be whatever was stored in MongoDB)
        fallbackImageCount++;
        console.warn(
          `Product "${product.slug}" has no cloudinaryUrl — using existing image path: ${product.image}`
        );
      }
    }

    // Write products.json (only available products, without internal fields)
    const staticProducts = products
      .filter((p) => p.available)
      .map((p) => ({
        slug: p.slug,
        name: p.name,
        tagline: p.tagline,
        category: p.category,
        image: p.image,
        volumes: p.volumes,
        description: p.description,
        ingredients: p.ingredients,
        howToEnjoy: p.howToEnjoy,
        storage: p.storage,
        bestBefore: p.bestBefore,
        deliveryDetails: p.deliveryDetails,
        tags: p.tags || [],
        badge: p.badge || "",
      }));

    fs.writeFileSync(
      path.join(dataDir, "products.json"),
      JSON.stringify(staticProducts, null, 2),
      "utf-8"
    );

    return NextResponse.json({
      success: true,
      totalProducts: products.length,
      availableProducts: staticProducts.length,
      cloudinaryImages: cloudinaryImageCount,
      fallbackImages: fallbackImageCount,
    });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json(
      { error: "Sync failed" },
      { status: 500 }
    );
  }
}
