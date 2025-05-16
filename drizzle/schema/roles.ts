import {pgTable, text, timestamp, uuid} from "drizzle-orm/pg-core";
import {organizations} from "./organizations";

export const roles = pgTable("roles", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(), // e.g. "Admin", "Instructor"
  description: text("description"),
  organizationId: uuid("organization_id").references(() => organizations.id),
  // .notNull(),

  createdAt: timestamp("created_at", {withTimezone: true}).defaultNow(),
  updatedAt: timestamp("updated_at", {withTimezone: true}).defaultNow(),
});
