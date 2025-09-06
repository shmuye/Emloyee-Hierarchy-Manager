ALTER TABLE "positions" DROP CONSTRAINT "positions_user_id_unique";--> statement-breakpoint
ALTER TABLE "positions" ADD COLUMN "created_by" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "positions" DROP COLUMN "user_id";