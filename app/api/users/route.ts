import {userProfiles} from "@/drizzle/schema";
import {userOrganization} from "@/drizzle/schema/user_organization";
import {userOrganizationRoles} from "@/drizzle/schema/user_organization_roles";
import {users} from "@/drizzle/schema/users";
import {db} from "@/lib/db";
import {NextRequest, NextResponse} from "next/server";

export async function GET(req: NextRequest) {
  const orgId = req.nextUrl.searchParams.get("orgId");

  if (!orgId) {
    return NextResponse.json({error: "Missing orgId"}, {status: 400});
  }

  // Step 1: Get all users
  const allUsers = await db.select().from(users);

  // Step 2: Get all org assignments
  const orgAssignments = await db.select().from(userOrganization);

  // Step 3: Get all user roles
  const roleAssignments = await db.select().from(userOrganizationRoles);

  // Step 4: Get all user profiles
  const allUserProfiles = await db.select().from(userProfiles);

  const usersWithRoles = allUsers.map((user) => {
    const roles = roleAssignments
      .filter((r) => r.userId === user.id)
      .map((r) => ({
        organizationId: r.organizationId || "",
        roleId: r.roleId || "",
      }));

    // Find the corresponding user profile
    const profile = allUserProfiles.find(
      (profile) => profile.userId === user.id
    );

    return {
      id: user.id,
      name: profile
        ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim()
        : "Unnamed",
      email: user.email || "",
      roles,
    };
  });

  return NextResponse.json(usersWithRoles);
}
