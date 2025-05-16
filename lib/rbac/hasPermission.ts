import {
  permissions,
  rolePermissions,
  userOrganizationRoles,
} from "@/drizzle/schema";
import {db} from "@/lib/db";
import {and, eq, inArray} from "drizzle-orm";

// Accepts either a string or array of permissions
export async function hasPermission(
  userId: string,
  permission: string | string[],
  orgId?: string
): Promise<boolean> {
  // 1. Get all role assignments for this user (optionally scoped to org)
  const where = orgId
    ? and(
        eq(userOrganizationRoles.userId, userId),
        eq(userOrganizationRoles.organizationId, orgId)
      )
    : eq(userOrganizationRoles.userId, userId);

  const userRoles = await db.select().from(userOrganizationRoles).where(where);

  const roleIds = userRoles.map((r) => r.roleId);
  if (!roleIds.length) return false;

  // 2. Fetch permissions for these roles
  const perms = await db
    .select()
    .from(rolePermissions)
    .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
    .where(inArray(rolePermissions.roleId, roleIds));

  // Convert all permissions to an array for uniformity
  const permissionArr = Array.isArray(permission) ? permission : [permission];

  // 3. Check if user has ANY of the required permissions
  return perms.some((p) => permissionArr.includes(p.permissions.name));
}
