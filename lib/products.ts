import { connectDB } from "@/lib/db/mongoose";
import ProductModel, { IProduct } from "@/lib/db/models/product";

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
}

// Hardcoded fallback products (used when DB is unavailable)
const fallbackProducts: Product[] = [
  {
    slug: "gourmet-brown-butter-cookies",
    name: "Gourmet Brown Butter Cookies",
    tagline: "Crisp edges. Soft centre. Worth every bite.",
    category: "Cookies",
    image: "/images/cookie-01.png",
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
  try {
    await connectDB();
    const dbProducts = await ProductModel.find({ available: true })
      .sort({ createdAt: -1 })
      .lean<IProduct[]>();

    if (dbProducts.length > 0) {
      return dbProducts.map((p: IProduct) => ({
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
      }));
    }
  } catch {
    // DB not available — use fallback
  }
  return fallbackProducts;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  try {
    await connectDB();
    const product = await ProductModel.findOne({ slug, available: true }).lean<IProduct | null>();
    if (product) {
      return {
        slug: product.slug,
        name: product.name,
        tagline: product.tagline,
        category: product.category,
        image: product.image,
        volumes: product.volumes.map((v: { label: string; price: number; originalPrice?: number }) => ({
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
      };
    }
  } catch {
    // DB not available — try fallback
  }
  return fallbackProducts.find((p) => p.slug === slug);
}

// Keep old export for backward compatibility
// New code should use getProducts() async function
export const products = fallbackProducts;
