ALTER TABLE "country_group_discounts" RENAME COLUMN "update_at" TO "updated_at";--> statement-breakpoint
ALTER TABLE "country_groups" RENAME COLUMN "update_at" TO "updated_at";--> statement-breakpoint
ALTER TABLE "countries" RENAME COLUMN "update_at" TO "updated_at";--> statement-breakpoint
ALTER TABLE "product_customizations" RENAME COLUMN "update_at" TO "updated_at";--> statement-breakpoint
ALTER TABLE "products" RENAME COLUMN "update_at" TO "updated_at";--> statement-breakpoint
ALTER TABLE "user_subscriptions" RENAME COLUMN "update_at" TO "updated_at";