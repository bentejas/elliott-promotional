// Server-side product utilities
import { db, products, type Product } from "../../db";
import { eq } from "drizzle-orm";

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const result = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);

    return result[0] || null;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    return await db.select().from(products).orderBy(products.createdAt);
  } catch (error) {
    console.error("Error fetching all products:", error);
    return [];
  }
}
