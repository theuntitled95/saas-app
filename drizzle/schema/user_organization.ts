import {pgTable, text, timestamp, uuid} from "drizzle-orm/pg-core";
import {organizations} from "./organizations";
import {users} from "./users";

export const userOrganization = pgTable("user_organization", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id),

  role: text("role").notNull(), // e.g. 'owner', 'admin', 'staff'

  status: text("status").default("active"), // active | suspended | invited

  createdAt: timestamp("created_at", {withTimezone: true}).defaultNow(),
  updatedAt: timestamp("updated_at", {withTimezone: true}).defaultNow(),

  createdBy: uuid("created_by"),
  updatedBy: uuid("updated_by"),
  deletedAt: timestamp("deleted_at", {withTimezone: true}),
  deletedBy: uuid("deleted_by"),
});
