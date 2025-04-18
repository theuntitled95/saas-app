import {jsonb, pgTable, text, timestamp, uuid} from "drizzle-orm/pg-core";

export const organizations = pgTable("organizations", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: text("name").notNull(),
  slug: text("slug").notNull().unique(), // For subdomain or URL use

  branding: jsonb("branding"), // optional: colors, logo, etc.

  createdAt: timestamp("created_at", {withTimezone: true}).defaultNow(),
  updatedAt: timestamp("updated_at", {withTimezone: true}).defaultNow(),

  createdBy: uuid("created_by"),
  updatedBy: uuid("updated_by"),
  deletedAt: timestamp("deleted_at", {withTimezone: true}),
  deletedBy: uuid("deleted_by"),
});
