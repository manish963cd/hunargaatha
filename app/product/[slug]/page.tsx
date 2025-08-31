import React from "react";
import ProductDetailClient from "./ProductDetailClient";
import { getProducts, getProductBySlug } from "@/lib/products";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

// ✅ Generate static params for SSG
export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

// ✅ Server Component (async is fine)
export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return <div className="p-6 text-red-500">Product not found</div>;
  }

  return <ProductDetailClient product={product} />;
}
