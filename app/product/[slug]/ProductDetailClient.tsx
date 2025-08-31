"use client";

import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { addItem, selectIsInCart } from "@/store/cartSlice";
import { Heart, ShoppingCart, Star, BadgeCheck } from "lucide-react";
// import wallcraft from '@/public/images/wallcraft.jpg'

interface Product {
  id: string;
  name: string;
  description: string;
  image?: string;
  price: number;
  artist?: string;
  slug: string;
  region?: string;
  craft?: string;
  rating?: number;
  reviews?: number;
  giTag?: boolean;
}

type Props = {
  product: Product;
};

export default function ProductDetailClient({ product }: Props) {
  const dispatch = useDispatch();
  const isInCart = useSelector((state) => selectIsInCart(state, product.slug));

  const handleAddToCart = () => {
    dispatch(addItem({ product: { ...product }, quantity: 1 }));
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-50">
      {/* Background with low opacity */}
      <div className="absolute inset-0" 
      style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1558522195-e1201b090344?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }} >
          {/* Overlay gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#96520fa5] via-white/50 to-[#43c73ea5]"></div>

        {/* <Image
          src={product.image || "https://unsplash.com/photos/two-human-hands-painting-k39RGHmLoV8" || wallcraft}
          loading="lazy"
          alt="Background"
          fill
          className="object-cover opacity-10"
        /> */}
      </div>

      {/* Main card */}
      <div className="relative bg-white shadow-2xl rounded p-8 max-w-5xl w-full grid md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="flex flex-col items-center">
          {product.image && (
            <Image
              width={400}
              height={400}
              loading="lazy"
              src={product.image}
              alt={product.name}
              className="w-full h-96 object-cover rounded-xl shadow-lg"
            />
          )}
          <button className="mt-4 flex items-center gap-2 text-red-600 hover:text-red-700">
            <Heart className="w-5 h-5" /> Add to Wishlist
          </button>
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>

          {/* Ratings & Reviews */}
          {product.rating && (
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < (product.rating || 0) ? "text-yellow-500" : "text-gray-300"
                  }`}
                />
              ))}
              <span className="ml-2 text-sm text-gray-500">
                ({product.reviews || 0} reviews)
              </span>
            </div>
          )}

          {/* Extra Info */}
          <div className="space-y-1 text-sm text-gray-700 mb-4">
            {product.artist && <p>👤 By: {product.artist}</p>}
            {product.region && <p>📍 Region: {product.region}</p>}
            {product.craft && <p>🎨 Craft: {product.craft}</p>}
            {product.giTag && (
              <p className="flex items-center gap-1 text-green-700 font-medium">
                <BadgeCheck className="w-4 h-4" /> GI Tag Certified
              </p>
            )}
          </div>

          {/* Price */}
          <p className="text-2xl font-semibold text-amber-700 mb-6">
            ₹{product.price}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-2 px-5 py-3 bg-amber-600 text-white shadow hover:bg-amber-700 transition"
            >
              <ShoppingCart className="w-5 h-5" />
              {isInCart ? "Added to Cart" : "Add to Cart"}
            </button>

            <button className="px-5 py-3 bg-green-600 text-white shadow hover:bg-green-700 transition">
              Buy Now
            </button>
          </div>

          <button className="mt-6 underline text-sm text-gray-500 hover:text-gray-700">
            View More Details
          </button>
        </div>
      </div>
    </div>
  );
}
