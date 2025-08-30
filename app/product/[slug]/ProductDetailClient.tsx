// app/product/[slug]/ProductDetailClient.tsx
'use client';

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItem, selectIsInCart } from "@/store/cartSlice";
import { doc, getDoc, DocumentData, DocumentSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingCart } from "lucide-react";

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
  slug: string;
};

export default function ProductDetailClient({ slug }: Props) {
  const dispatch = useDispatch();
  const isInCart = useSelector((state) => selectIsInCart(state, slug));

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", slug);
        const docSnap: DocumentSnapshot<DocumentData> = await getDoc(docRef);

        if (docSnap.exists()) {
          setProduct({ ...docSnap.data() as Product, id: docSnap.id, slug: docSnap.id });
        } else {
          setError("Product not found.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(addItem({ product: { ...product, id: product.slug }, quantity }));
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error || !product) return <div>{error || "Product not found."}</div>;

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <button onClick={handleAddToCart}>
        {isInCart ? "Added to Cart" : "Add to Cart"}
      </button>
    </div>
  );
}
