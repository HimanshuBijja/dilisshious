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
    const imagesDir = path.join(publicDir, "images");
    const dataDir = path.join(publicDir, "data");

    // Ensure directories exist
    fs.mkdirSync(imagesDir, { recursive: true });
    fs.mkdirSync(dataDir, { recursive: true });

    // Download images from Cloudinary
    let downloadedCount = 0;
    let failedCount = 0;

    for (const product of products) {
      if (product.cloudinaryUrl) {
        try {
          const response = await fetch(product.cloudinaryUrl);
          if (!response.ok) {
            console.error(`Failed to download image for ${product.slug}: ${response.status}`);
            failedCount++;
            continue;
          }

          // Determine file extension from URL or content type
          const contentType = response.headers.get("content-type") || "image/png";
          const extMap: Record<string, string> = {
            "image/png": "png",
            "image/jpeg": "jpg",
            "image/jpg": "jpg",
            "image/webp": "webp",
            "image/gif": "gif",
          };
          const ext = extMap[contentType] || "png";
          const filename = `${product.slug}.${ext}`;
          const filePath = path.join(imagesDir, filename);

          // Write file
          const buffer = Buffer.from(await response.arrayBuffer());
          fs.writeFileSync(filePath, buffer);

          // Update the image path to match local file
          product.image = `/images/${filename}`;
          downloadedCount++;
        } catch (err) {
          console.error(`Error downloading image for ${product.slug}:`, err);
          failedCount++;
        }
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
      imagesDownloaded: downloadedCount,
      imagesFailed: failedCount,
    });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json(
      { error: "Sync failed" },
      { status: 500 }
    );
  }
}
