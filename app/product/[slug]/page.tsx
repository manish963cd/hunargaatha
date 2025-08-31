import React from "react";
import ProductDetailClient from "./ProductDetailClient";
import { getProducts, getProductBySlug } from "@/lib/products";
import type { Metadata } from "next";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

// ✅ Generate static paths for all products (SSG)
export async function generateStaticParams() {
  const products = await getProducts();

  // Debug log (only visible during build, not in production runtime)
  products.forEach((p) => {
    if (!p.slug) {
      console.warn("⚠️ Missing slug for product:", p);
    }
  });

  return products
    .filter((p) => typeof p.slug === "string" && p.slug.trim() !== "")
    .map((p) => ({
      slug: p.slug,
    }));
}

// ✅ Dynamic metadata for SEO
export async function generateMetadata(
  { params }: ProductPageProps
): Promise<Metadata> {
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

// ✅ Server Component (fetch product once on server)
export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return <div className="p-6 text-red-500">Product not found</div>;
  }

  return <ProductDetailClient product={{ ...product, description: product.description ?? "" }} />;
}
