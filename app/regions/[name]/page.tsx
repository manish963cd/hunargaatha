import React from "react";
import { getProducts } from "@/lib/products"; // Use your existing products function
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";

// ✅ Server Component - Next.js 15+ compatible
export default async function RegionPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  try {
    // Await the params promise
    const { name } = await params;
    
    // Decode the region name in case it's URL encoded
    const regionName = decodeURIComponent(name);
    
    // Filter products by region from all products
    const allProducts = await getProducts();
    const products = allProducts.filter(product => 
      product.region?.toLowerCase() === regionName.toLowerCase() ||
      product.category?.toLowerCase() === regionName.toLowerCase()
    );

    if (!products || products.length === 0) {
      notFound();
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Products from {regionName}
          </h1>
          <p className="text-gray-600">
            Discover authentic handmade crafts from {regionName}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {product.image && (
                <Image
                fill
                loading='lazy'
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {product.name}
                </h3>
                {product.description && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                )}
                {product.price && (
                  <p className="text-xl font-bold text-green-600 mb-3">
                    ₹{product.price.toLocaleString()}
                  </p>
                )}
                <a
                  href={`/product/${product.slug}`}
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  View Details
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching region products:", error);
    notFound();
  }
}

// ✅ Generate static params for SSG - Next.js 15+ compatible
export async function generateStaticParams(): Promise<{ name: string }[]> {
  try {
    const products = await getProducts();
    
    // Get unique regions/categories from products
    const regions = new Set<string>();
    
    products.forEach(product => {
      if (product.region) regions.add(product.region);
      if (product.category) regions.add(product.category);
    });
    
    return Array.from(regions)
      .filter(region => region && region.trim() !== "")
      .map(region => ({ 
        name: encodeURIComponent(region) 
      }));
  } catch (error) {
    console.error("Error generating static params for regions:", error);
    return []; // Return empty array on error to prevent build failure
  }
}

// ✅ Metadata - Next.js 15+ compatible
export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}): Promise<Metadata> {
  try {
    // Await the params promise
    const { name } = await params;
    const regionName = decodeURIComponent(name);
    
    const allProducts = await getProducts();
    const products = allProducts.filter(product => 
      product.region?.toLowerCase() === regionName.toLowerCase() ||
      product.category?.toLowerCase() === regionName.toLowerCase()
    );

    if (!products || products.length === 0) {
      return {
        title: "Region not found - Hunar Gaatha",
        description: "This region could not be found.",
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    const title = `${regionName} Crafts - Hunar Gaatha`;
    const description = `Discover authentic handmade crafts and products from ${regionName}. Shop unique items made by local artisans.`;

    return {
      title,
      description,
      keywords: [regionName, "handmade", "crafts", "artisan", "local products"],
      openGraph: {
        title,
        description,
        type: "website",
        siteName: "Hunar Gaatha",
        images: products[0]?.image 
          ? [
              {
                url: products[0].image,
                alt: `Products from ${regionName}`,
                width: 1200,
                height: 630,
              }
            ]
          : [],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: products[0]?.image ? [products[0].image] : [],
      },
      alternates: {
        canonical: `/regions/${encodeURIComponent(regionName)}`,
      },
    };
  } catch (error) {
    console.error("Error generating metadata for region:", error);
    return {
      title: "Regions - Hunar Gaatha",
      description: "Explore handmade crafts from different regions",
    };
  }
}