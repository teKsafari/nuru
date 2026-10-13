CREATE TABLE "madarasa" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"teacher_logto_id" text NOT NULL,
	"organization_id" text,
	"module_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"archived_at" timestamp with time zone,
	CONSTRAINT "madarasa_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "maendeleo" (
	"id" text PRIMARY KEY NOT NULL,
	"mwanafunzi_id" text,
	"logto_id" text,
	"lesson_id" text NOT NULL,
	"module_id" text NOT NULL,
	"passed" boolean DEFAULT false NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"last_code" text,
	"first_passed_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "maendeleo_owner_ck" CHECK ("maendeleo"."mwanafunzi_id" IS NOT NULL OR "maendeleo"."logto_id" IS NOT NULL)
);
--> statement-breakpoint
CREATE TABLE "wanafunzi" (
	"id" text PRIMARY KEY NOT NULL,
	"darasa_id" text NOT NULL,
	"display_name" text NOT NULL,
	"picture_hash" text,
	"logto_id" text,
	"failed_attempts" integer DEFAULT 0 NOT NULL,
	"locked_until" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_seen_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "madarasa" ADD CONSTRAINT "madarasa_teacher_logto_id_users_logto_id_fk" FOREIGN KEY ("teacher_logto_id") REFERENCES "public"."users"("logto_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "madarasa" ADD CONSTRAINT "madarasa_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maendeleo" ADD CONSTRAINT "maendeleo_mwanafunzi_id_wanafunzi_id_fk" FOREIGN KEY ("mwanafunzi_id") REFERENCES "public"."wanafunzi"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maendeleo" ADD CONSTRAINT "maendeleo_logto_id_users_logto_id_fk" FOREIGN KEY ("logto_id") REFERENCES "public"."users"("logto_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maendeleo" ADD CONSTRAINT "maendeleo_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wanafunzi" ADD CONSTRAINT "wanafunzi_darasa_id_madarasa_id_fk" FOREIGN KEY ("darasa_id") REFERENCES "public"."madarasa"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wanafunzi" ADD CONSTRAINT "wanafunzi_logto_id_users_logto_id_fk" FOREIGN KEY ("logto_id") REFERENCES "public"."users"("logto_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "madarasa_teacher_idx" ON "madarasa" USING btree ("teacher_logto_id");--> statement-breakpoint
CREATE UNIQUE INDEX "maendeleo_mwanafunzi_lesson_uq" ON "maendeleo" USING btree ("mwanafunzi_id","lesson_id");--> statement-breakpoint
CREATE UNIQUE INDEX "maendeleo_logto_lesson_uq" ON "maendeleo" USING btree ("logto_id","lesson_id");--> statement-breakpoint
CREATE UNIQUE INDEX "wanafunzi_darasa_name_uq" ON "wanafunzi" USING btree ("darasa_id","display_name");--> statement-breakpoint
CREATE UNIQUE INDEX "wanafunzi_darasa_logto_uq" ON "wanafunzi" USING btree ("darasa_id","logto_id");