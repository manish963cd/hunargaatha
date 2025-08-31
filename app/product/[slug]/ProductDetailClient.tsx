"use client";

import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { addItem, selectIsInCart } from "@/store/cartSlice";

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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
      <p className="text-gray-700 mb-4">{product.description}</p>

      {product.image && (
        <Image
          width={256}
          height={256}
          loading="lazy"
          src={product.image}
          alt={product.name}
          className="w-64 h-64 object-cover mb-4 rounded-lg shadow"
        />
      )}

      <p className="text-lg font-semibold">₹{product.price}</p>
      {product.artist && <p className="text-sm text-gray-600">By {product.artist}</p>}
      {product.region && <p className="text-sm text-gray-600">Region: {product.region}</p>}

      <button
        onClick={handleAddToCart}
        className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
      >
        {isInCart ? "Added to Cart" : "Add to Cart"}
      </button>
    </div>
  );
}
