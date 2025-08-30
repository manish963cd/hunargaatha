// app/product/[slug]/page.tsx
import React from "react";
import ProductDetailClient from "./ProductDetailClient";
import { products } from "@/app/api/products/route"; // your function to fetch all slugs

type Props = {
  params: { slug: string };
};

// Required for static export
export async function generateStaticParams() {
  const slugs = await products(); // e.g., ["product-1", "product-2"]
  return slugs.map((slug) => ({ slug }));
}

// Server component wrapper
export default function ProductPage({ params }: Props) {
  return <ProductDetailClient slug={params.slug} />;
}
