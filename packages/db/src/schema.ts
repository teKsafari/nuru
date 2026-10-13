import { pgTable, text, timestamp, integer, jsonb, uuid, foreignKey, boolean, index, uniqueIndex, check } from "drizzle-orm/pg-core";
import { sql, relations } from "drizzle-orm";
import type { TestCaseV1 } from "@nuru/ui/validation/test-cases";

// i18n structure for localized fields
export type LocalizedString = {
	en: string;
	sw: string;
};

// --- Auth & Users ---

export const users = pgTable("users", {
	id: text("id").primaryKey().notNull(),
	logtoId: text("logto_id").unique().notNull(),
	name: text("name"),
	email: text("email"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const organizations = pgTable("organizations", {
	id: text("id").primaryKey().notNull(),
	name: text("name").notNull(),
	slug: text("slug").unique().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

// --- Content: Modules & Lessons ---

export const modules = pgTable("modules", {
	id: text("id").primaryKey().notNull(),
	slug: text("slug").unique().notNull(),
	title: jsonb("title").$type<LocalizedString>().notNull(),
	difficulty: text("difficulty"), // e.g., 'beginner', 'intermediate'
	executorType: text("executor_type").default('nuru-wasm').notNull(),
	visibility: text("visibility").default('private').notNull(), // 'public', 'private', 'organization'
	layoutConfig: jsonb("layout_config").notNull(), // { terminal: boolean, canvas: boolean, etc. }
	order: integer("order").default(0).notNull(),
	organizationId: text("organization_id"),
	createdBy: text("created_by").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
		columns: [table.organizationId],
		foreignColumns: [organizations.id],
		name: "modules_organization_id_organizations_id_fk"
	}).onDelete("set null"),
	foreignKey({
		columns: [table.createdBy],
		foreignColumns: [users.logtoId],
		name: "modules_created_by_users_logto_id_fk"
	}).onDelete("cascade"),
]);

export const lessons = pgTable("lessons", {
	id: text("id").primaryKey().notNull(),
	moduleId: text("module_id").notNull(),
	slug: text("slug").notNull(),
	title: jsonb("title").$type<LocalizedString>().notNull(),
	description: jsonb("description").$type<LocalizedString>().notNull(),
	task: jsonb("task").$type<LocalizedString>(),
	defaultCode: text("default_code"),
	solution: text("solution"),
	tests: jsonb("tests").$type<TestCaseV1[]>().notNull(), // Array of TestCase
	order: integer("order").default(0).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
		columns: [table.moduleId],
		foreignColumns: [modules.id],
		name: "lessons_module_id_modules_id_fk"
	}).onDelete("cascade"),
]);

// --- Relations ---

export const modulesRelations = relations(modules, ({ many, one }) => ({
	lessons: many(lessons),
	organization: one(organizations, {
		fields: [modules.organizationId],
		references: [organizations.id],
	}),
}));

export const lessonsRelations = relations(lessons, ({ one }) => ({
	module: one(modules, {
		fields: [lessons.moduleId],
		references: [modules.id],
	}),
}));

export const organizationsRelations = relations(organizations, ({ many }) => ({
	modules: many(modules),
}));

// --- Darasa: classrooms ---
// A teacher (a Logto user) opens a darasa and shares its join code. Learners
// (wanafunzi) join with the code, a display name and a picture password, so
// shared devices work without email. Progress (maendeleo) belongs either to a
// mwanafunzi or to a signed-in Logto user.

export const madarasa = pgTable("madarasa", {
	id: text("id").primaryKey().notNull(),
	name: text("name").notNull(),
	code: text("code").unique().notNull(),
	teacherLogtoId: text("teacher_logto_id").notNull(),
	organizationId: text("organization_id"),
	moduleIds: jsonb("module_ids").$type<string[]>().default(sql`'[]'::jsonb`).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	archivedAt: timestamp("archived_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	foreignKey({
		columns: [table.teacherLogtoId],
		foreignColumns: [users.logtoId],
		name: "madarasa_teacher_logto_id_users_logto_id_fk"
	}).onDelete("cascade"),
	foreignKey({
		columns: [table.organizationId],
		foreignColumns: [organizations.id],
		name: "madarasa_organization_id_organizations_id_fk"
	}).onDelete("set null"),
	index("madarasa_teacher_idx").on(table.teacherLogtoId),
]);

export const wanafunzi = pgTable("wanafunzi", {
	id: text("id").primaryKey().notNull(),
	darasaId: text("darasa_id").notNull(),
	displayName: text("display_name").notNull(),
	// scrypt hash of the picture sequence, "salt:hash" in hex. Null after a teacher reset:
	// the learner sets new pictures on their next sign-in.
	pictureHash: text("picture_hash"),
	logtoId: text("logto_id"),
	failedAttempts: integer("failed_attempts").default(0).notNull(),
	lockedUntil: timestamp("locked_until", { withTimezone: true, mode: 'string' }),
	// How many locks in a row (1m, 5m, 30m). At LOCK_LEVEL_TEACHER the learner
	// stays locked until a teacher resets their pictures. Cleared on success.
	lockLevel: integer("lock_level").default(0).notNull(),
	// Signed into every learner session cookie. Bumping it signs out every device
	// (teacher reset, pictures newly set). Cookies issued before the column existed count as 0.
	sessionVersion: integer("session_version").default(0).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	lastSeenAt: timestamp("last_seen_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	foreignKey({
		columns: [table.darasaId],
		foreignColumns: [madarasa.id],
		name: "wanafunzi_darasa_id_madarasa_id_fk"
	}).onDelete("cascade"),
	foreignKey({
		columns: [table.logtoId],
		foreignColumns: [users.logtoId],
		name: "wanafunzi_logto_id_users_logto_id_fk"
	}).onDelete("set null"),
	uniqueIndex("wanafunzi_darasa_name_uq").on(table.darasaId, table.displayName),
	uniqueIndex("wanafunzi_darasa_logto_uq").on(table.darasaId, table.logtoId),
]);

export const maendeleo = pgTable("maendeleo", {
	id: text("id").primaryKey().notNull(),
	mwanafunziId: text("mwanafunzi_id"),
	logtoId: text("logto_id"),
	lessonId: text("lesson_id").notNull(),
	moduleId: text("module_id").notNull(),
	passed: boolean("passed").default(false).notNull(),
	attempts: integer("attempts").default(0).notNull(),
	lastCode: text("last_code"),
	firstPassedAt: timestamp("first_passed_at", { withTimezone: true, mode: 'string' }),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
		columns: [table.mwanafunziId],
		foreignColumns: [wanafunzi.id],
		name: "maendeleo_mwanafunzi_id_wanafunzi_id_fk"
	}).onDelete("cascade"),
	foreignKey({
		columns: [table.logtoId],
		foreignColumns: [users.logtoId],
		name: "maendeleo_logto_id_users_logto_id_fk"
	}).onDelete("cascade"),
	foreignKey({
		columns: [table.lessonId],
		foreignColumns: [lessons.id],
		name: "maendeleo_lesson_id_lessons_id_fk"
	}).onDelete("cascade"),
	uniqueIndex("maendeleo_mwanafunzi_lesson_uq").on(table.mwanafunziId, table.lessonId),
	uniqueIndex("maendeleo_logto_lesson_uq").on(table.logtoId, table.lessonId),
	check("maendeleo_owner_ck", sql`${table.mwanafunziId} IS NOT NULL OR ${table.logtoId} IS NOT NULL`),
]);

export const madarasaRelations = relations(madarasa, ({ many, one }) => ({
	wanafunzi: many(wanafunzi),
	teacher: one(users, {
		fields: [madarasa.teacherLogtoId],
		references: [users.logtoId],
	}),
}));

export const wanafunziRelations = relations(wanafunzi, ({ one, many }) => ({
	darasa: one(madarasa, {
		fields: [wanafunzi.darasaId],
		references: [madarasa.id],
	}),
	maendeleo: many(maendeleo),
}));

export const maendeleoRelations = relations(maendeleo, ({ one }) => ({
	mwanafunzi: one(wanafunzi, {
		fields: [maendeleo.mwanafunziId],
		references: [wanafunzi.id],
	}),
	lesson: one(lessons, {
		fields: [maendeleo.lessonId],
		references: [lessons.id],
	}),
}));
