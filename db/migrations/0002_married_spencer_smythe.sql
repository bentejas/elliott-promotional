ALTER TABLE "products" ADD COLUMN "primary_color" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "color_images" json DEFAULT '{}'::json;