import { pgTable, text, timestamp, integer, jsonb, uuid, foreignKey } from "drizzle-orm/pg-core";
import { sql, relations } from "drizzle-orm";

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
	tests: jsonb("tests").notNull(), // Array of TestCase
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
