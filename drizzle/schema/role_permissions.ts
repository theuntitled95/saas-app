import {pgTable, uuid} from "drizzle-orm/pg-core";
import {permissions} from "./permissions";
import {roles} from "./roles";

export const rolePermissions = pgTable("role_permissions", {
  roleId: uuid("role_id")
    .references(() => roles.id)
    .notNull(),
  permissionId: uuid("permission_id")
    .references(() => permissions.id)
    .notNull(),
});
