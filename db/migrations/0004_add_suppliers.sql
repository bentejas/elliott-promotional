CREATE TABLE "suppliers" (
	"id" text PRIMARY KEY NOT NULL,
	"supplier_name" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "supplier_id" text REFERENCES "suppliers"("id");
