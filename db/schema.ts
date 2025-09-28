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
  primaryColor: text("primary_color"), // The primary color for product previews
  sizes: json("sizes").$type<string[]>().default([]),
  gender: text("gender").notNull(), // e.g., "unisex", "men", "women", "kids"
  priceLow: real("price_low").default(0),
  priceHigh: real("price_high").default(0),
  imgSrc: text("img_src").notNull(), // Deprecated - keeping for backward compatibility
  secondaryImages: json("secondary_images").$type<string[]>().default([]), // Deprecated - keeping for backward compatibility
  colorImages: json("color_images")
    .$type<Record<string, string[]>>()
    .default({}), // New: color -> array of image URLs
  category: text("category").notNull(), // e.g., "apparel", "drinkware", etc.
  subCategory: text("sub_category").default(""),
  brand: text("brand").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export const quoteRequests = pgTable("quote_requests", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  customerName: text("customer_name").notNull(),
  emailAddress: text("email_address").notNull(),
  phoneNumber: text("phone_number").notNull(),
  additionalInformation: text("additional_information"),
  productDetails: text("product_details").notNull(), // JSON string containing product codes, quantities, sizes, colors
  createdAt: timestamp("created_at").defaultNow(),
});

export type QuoteRequest = typeof quoteRequests.$inferSelect;
export type NewQuoteRequest = typeof quoteRequests.$inferInsert;
