CREATE TABLE "products" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"product_code" text NOT NULL,
	"colours" json DEFAULT '[]'::json,
	"sizes" json DEFAULT '[]'::json,
	"gender" text NOT NULL,
	"price_low" real NOT NULL,
	"price_high" real NOT NULL,
	"img_src" text NOT NULL,
	"secondary_images" json DEFAULT '[]'::json,
	"category" text NOT NULL,
	"brand" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "products_product_code_unique" UNIQUE("product_code")
);
