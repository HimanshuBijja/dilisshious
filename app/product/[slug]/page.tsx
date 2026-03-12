import { getProducts, getProductBySlug } from "@/lib/products";
import { notFound } from "next/navigation";
import ProductPageClient from "./product-page-client";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductPageClient product={product} />;
}
