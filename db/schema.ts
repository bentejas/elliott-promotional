// db/schema.ts
import { pgTable, text, real, json, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const products = pgTable("products", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  title: text("title").notNull(),
  description: text("description").notNull(),
  productCode: text("product_code").notNull().unique(),
  colours: json("colours").$type<string[]>().default([]),
  sizes: json("sizes").$type<string[]>().default([]),
  gender: text("gender").notNull(), // e.g., "unisex", "men", "women", "kids"
  priceLow: real("price_low").notNull(),
  priceHigh: real("price_high").notNull(),
  imgSrc: text("img_src").notNull(),
  secondaryImages: json("secondary_images").$type<string[]>().default([]),
  category: text("category").notNull(), // e.g., "apparel", "drinkware", etc.
  brand: text("brand").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
