import React from "react";
import ProductDetailClient from "./ProductDetailClient";
import { getProducts, getProductBySlug } from "@/lib/products";
import type { Metadata } from "next";

// ✅ Server Component
export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return <div className="p-6 text-red-500">Product not found</div>;
  }

  return (
    <ProductDetailClient
      product={{
        ...product,
        description: product.description ?? "",
      }}
    />
  );
}

// ✅ Generate static params for SSG
export async function generateStaticParams() {
  const products = await getProducts();
  return products
    .filter((p) => p.slug)
    .map((p) => ({ slug: p.slug! }));
}

// ✅ Metadata
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return {
      title: "Product not found - Hunar Gaatha",
      description: "This product could not be found.",
    };
  }

  return {
    title: `${product.name} - Hunar Gaatha`,
    description: product.description || "Explore unique handmade crafts",
    openGraph: {
      title: product.name,
      description: product.description || "",
      images: product.image ? [product.image] : [],
    },
  };
}
