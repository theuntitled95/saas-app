import {permissions} from "@/drizzle/schema/permissions";
import {rolePermissions} from "@/drizzle/schema/role_permissions";
import {roles} from "@/drizzle/schema/roles";
import {db} from "@/lib/db";

async function seedPermissions() {
  const perms = [
    {name: "manage_users", description: "Create, update, remove users"},
    {name: "manage_courses", description: "Create, update, delete courses"},
    {name: "view_reports", description: "Access reports and analytics"},
  ];

  for (const perm of perms) {
    await db.insert(permissions).values(perm).onConflictDoNothing();
  }
}

async function seedRoles() {
  const adminRole = await db
    .insert(roles)
    .values({
      name: "Admin",
      description: "Has full access",
      organizationId: "dc7edf10-2118-4960-823e-e89b00123c68", // replace or dynamically insert org
    })
    .returning({id: roles.id});

  const allPerms = await db.select().from(permissions);
  const rolePerms = allPerms.map((perm) => ({
    roleId: adminRole[0].id,
    permissionId: perm.id,
  }));

  await db.insert(rolePermissions).values(rolePerms).onConflictDoNothing();
}

async function main() {
  await seedPermissions();
  await seedRoles();
  console.log("Seeding complete.");
}

main();
