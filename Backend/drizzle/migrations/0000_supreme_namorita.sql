CREATE TYPE "public"."roles" AS ENUM('Admin', 'User');--> statement-breakpoint
CREATE TABLE "positions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"parent_id" uuid,
	"user_id" uuid,
	CONSTRAINT "positions_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"role" "roles" DEFAULT 'User' NOT NULL,
	"avatar" varchar(512),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
