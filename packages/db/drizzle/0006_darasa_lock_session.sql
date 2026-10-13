ALTER TABLE "wanafunzi" ADD COLUMN "lock_level" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "wanafunzi" ADD COLUMN "session_version" integer DEFAULT 0 NOT NULL;