import {permissions} from "@/drizzle/schema/permissions";
import {rolePermissions} from "@/drizzle/schema/role_permissions";
import {roles} from "@/drizzle/schema/roles";
import {db} from "@/lib/db";
import {eq} from "drizzle-orm";
import {NextResponse} from "next/server";

export async function GET() {
  try {
    const dbRoles = await db.select().from(roles);
    const enrichedRoles = await Promise.all(
      dbRoles.map(async (role) => {
        const perms = await db
          .select({permission: permissions.name})
          .from(rolePermissions)
          .where(eq(rolePermissions.roleId, role.id))
          .leftJoin(
            permissions,
            eq(rolePermissions.permissionId, permissions.id)
          );

        return {
          id: role.id,
          name: role.name,
          description: role.description,
          permissions: perms.map((p) => p.permission),
        };
      })
    );

    return NextResponse.json(enrichedRoles);
  } catch (error) {
    console.error("Failed to fetch roles:", error);
    return NextResponse.json({error: "Internal Server Error"}, {status: 500});
  }
}
