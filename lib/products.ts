import * as fs from "fs";
import * as path from "path";

export interface ProductVolume {
  label: string;
  price: number;
  originalPrice?: number;
}

export interface Product {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  image: string;
  volumes: ProductVolume[];
  description: string;
  ingredients: string;
  howToEnjoy: string;
  storage: string;
  bestBefore: string;
  deliveryDetails: string;
  tags?: string[];
  badge?: string;
}

// Read products from static JSON file (zero DB calls)
function readStaticProducts(): Product[] | null {
  try {
    const filePath = path.join(process.cwd(), "public", "data", "products.json");
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(data) as Product[];
    }
  } catch (err) {
    console.error("Failed to read static products:", err);
  }
  return null;
}

// Hardcoded fallback product (used when static JSON is not available yet)
const fallbackProducts: Product[] = [
  {
    slug: "gourmet-brown-butter-cookies",
    name: "Gourmet Brown Butter Cookies",
    tagline: "Crisp edges. Soft centre. Worth every bite.",
    category: "Cookies",
    image: "/images/gourmet-brown-butter-cookies.jpg",
    volumes: [
      { label: "Pack of 4", price: 299, originalPrice: 349 },
      { label: "Pack of 8", price: 549, originalPrice: 649 },
    ],
    description:
      'These cookies begin with patience. We slowly brown the butter until it turns nutty, aromatic, and golden, then fold it into a dough that\'s crisp on the edges, soft at the centre filled with a mix of organically sourced dark & milk chocolate. Each bite tastes like warmth, nostalgia, and a quiet luxury you didn\'t know you needed. This is not a "guilt-free" cookie. It\'s a worth-it cookie.',
    ingredients:
      "Browned butter, organic flour, raw sugar & jaggery, eggs, natural vanilla, baking soda, Himalayan salt",
    howToEnjoy:
      "Perfect with black coffee, cup of cold milk, evening tea, or eaten straight from the jar while standing in your kitchen.",
    storage: "Store in an airtight container at room temperature.",
    bestBefore: "7 days from date of manufacture",
    deliveryDetails:
      "We deliver on Wednesdays and Sundays. Orders placed before 8 PM the previous day will be delivered on the next delivery day.",
    tags: ["Bestseller"],
  },
];

export async function getProducts(): Promise<Product[]> {
  // Try static JSON first (zero DB calls)
  const staticProducts = readStaticProducts();
  if (staticProducts && staticProducts.length > 0) {
    return staticProducts;
  }

  // Fallback to DB if static JSON doesn't exist yet
  try {
    const { connectDB } = await import("@/lib/db/mongoose");
    const { default: ProductModel } = await import("@/lib/db/models/product");
    await connectDB();
    const dbProducts = await ProductModel.find({ available: true })
      .sort({ createdAt: -1 })
      .lean();

    if (dbProducts.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return dbProducts.map((p: any) => ({
        slug: p.slug,
        name: p.name,
        tagline: p.tagline,
        category: p.category,
        image: p.image,
        volumes: p.volumes.map((v: { label: string; price: number; originalPrice?: number }) => ({
          label: v.label,
          price: v.price,
          originalPrice: v.originalPrice,
        })),
        description: p.description,
        ingredients: p.ingredients,
        howToEnjoy: p.howToEnjoy,
        storage: p.storage,
        bestBefore: p.bestBefore,
        deliveryDetails: p.deliveryDetails,
        tags: p.tags,
        badge: p.badge,
      }));
    }
  } catch {
    // DB not available — use fallback
  }
  return fallbackProducts;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  // Try static JSON first (zero DB calls)
  const staticProducts = readStaticProducts();
  if (staticProducts && staticProducts.length > 0) {
    return staticProducts.find((p) => p.slug === slug);
  }

  // Fallback to DB if static JSON doesn't exist yet
  try {
    const { connectDB } = await import("@/lib/db/mongoose");
    const { default: ProductModel } = await import("@/lib/db/models/product");
    await connectDB();
    const product = await ProductModel.findOne({ slug, available: true }).lean();
    if (product) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const p = product as any;
      return {
        slug: p.slug,
        name: p.name,
        tagline: p.tagline,
        category: p.category,
        image: p.image,
        volumes: p.volumes.map((v: { label: string; price: number; originalPrice?: number }) => ({
          label: v.label,
          price: v.price,
          originalPrice: v.originalPrice,
        })),
        description: p.description,
        ingredients: p.ingredients,
        howToEnjoy: p.howToEnjoy,
        storage: p.storage,
        bestBefore: p.bestBefore,
        deliveryDetails: p.deliveryDetails,
        tags: p.tags,
        badge: p.badge,
      };
    }
  } catch {
    // DB not available — try fallback
  }
  return fallbackProducts.find((p) => p.slug === slug);
}

// Keep old export for backward compatibility
export const products = fallbackProducts;
