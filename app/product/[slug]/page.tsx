import React from "react";
import ProductDetailClient from "./ProductDetailClient";
import { getProducts, getProductBySlug } from "@/lib/products";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

// ✅ Server Component - Next.js 15+ compatible
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Await the params promise
  const { slug } = await params;
  
  try {
    const product = await getProductBySlug(slug);

    if (!product) {
      notFound(); // Better UX than custom error message
    }

    return (
      <ProductDetailClient
        product={{
          ...product,
          description: product.description ?? "",
        }}
      />
    );
  } catch (error) {
    console.error("Error fetching product:", error);
    notFound();
  }
}

// ✅ Generate static params for SSG - Next.js 15+ compatible
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    const products = await getProducts();
    return products
      .filter((p) => p.slug && p.slug.trim() !== "")
      .map((p) => ({ slug: p.slug! }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return []; // Return empty array on error to prevent build failure
  }
}

// ✅ Metadata - Next.js 15+ compatible
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    // Await the params promise
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
      return {
        title: "Product not found - Hunar Gaatha",
        description: "This product could not be found.",
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    const title = `${product.name} - Hunar Gaatha`;
    const description = product.description || "Explore unique handmade crafts from Hunar Gaatha";

    return {
      title,
      description,
      keywords: product.category ? [product.category, "handmade", "crafts"] : ["handmade", "crafts"],
      openGraph: {
        title: product.name,
        description,
        images: product.image 
          ? [
              {
                url: product.image,
                alt: product.name,
                width: 1200,
                height: 630,
              }
            ] 
          : [],
        type: "website",
        siteName: "Hunar Gaatha",
      },
      twitter: {
        card: "summary_large_image",
        title: product.name,
        description,
        images: product.image ? [product.image] : [],
      },
      alternates: {
        canonical: `/product/${slug}`,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Product - Hunar Gaatha",
      description: "Explore unique handmade crafts",
    };
  }
}