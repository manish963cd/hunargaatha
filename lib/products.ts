import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, limit } from "firebase/firestore";

export type Product = {
  category: any;
  id: string;
  slug: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  artist?: string;
  region?: string;
  craft?: string;
  rating?: number;
  reviews?: number;
  giTag?: boolean;
};

// ✅ Fetch all products
export async function getProducts(): Promise<Product[]> {
  try {
    const productsRef = collection(db, "products");
    const snapshot = await getDocs(productsRef);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Product, "id">),
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

// ✅ Fetch single product by slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const productsRef = collection(db, "products");
    const q = query(productsRef, where("slug", "==", slug), limit(1));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    const docSnap = snapshot.docs[0];
    return {
      id: docSnap.id,
      ...(docSnap.data() as Omit<Product, "id">),
    };
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
}
