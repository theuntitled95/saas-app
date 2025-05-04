import {pgTable, timestamp, uuid} from "drizzle-orm/pg-core";
import {organizations} from "./organizations";
import {roles} from "./roles";
import {users} from "./users";

export const userOrganizationRoles = pgTable("user_organization_roles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  organizationId: uuid("organization_id")
    .references(() => organizations.id)
    .notNull(),
  roleId: uuid("role_id")
    .references(() => roles.id)
    .notNull(),

  createdAt: timestamp("created_at", {withTimezone: true}).defaultNow(),
});
