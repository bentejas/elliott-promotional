CREATE TABLE "quote_requests" (
	"id" text PRIMARY KEY NOT NULL,
	"customer_name" text NOT NULL,
	"email_address" text NOT NULL,
	"phone_number" text NOT NULL,
	"additional_information" text,
	"product_details" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
