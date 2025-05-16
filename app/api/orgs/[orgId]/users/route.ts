import {
  userOrganization,
  userOrganizationRoles,
  userProfiles,
  users,
} from "@/drizzle/schema";
import {getSessionFromRequest} from "@/lib/auth/session";
import {db} from "@/lib/db";
import {hasPermission} from "@/lib/rbac/hasPermission";
import {eq, inArray} from "drizzle-orm";
import {NextRequest, NextResponse} from "next/server";

export async function GET(
  req: NextRequest,
  {params}: {params: {orgId: string}}
) {
  const orgId = params.orgId;
  const session = await getSessionFromRequest({cookies: req.cookies});
  if (!session?.userId) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  // DEV can view any org, OR user must have org-level permission in the requested org
  const isDEV = await hasPermission(session.userId, "view:users_all");
  const hasOrgView = await hasPermission(
    session.userId,
    "view:users_org",
    orgId
  );

  if (!isDEV && !hasOrgView) {
    return NextResponse.json({error: "Forbidden"}, {status: 403});
  }

  // Only fetch users who are members of this org
  const orgMemberships = await db
    .select()
    .from(userOrganization)
    .where(eq(userOrganization.organizationId, orgId));
  const memberIds = orgMemberships.map((m) => m.userId);

  const orgUsers = await db
    .select()
    .from(users)
    .where(inArray(users.id, memberIds));
  const allUserProfiles = await db.select().from(userProfiles);
  const roleAssignments = await db.select().from(userOrganizationRoles);

  const usersWithRoles = orgUsers.map((user) => {
    const roles = roleAssignments
      .filter((r) => r.userId === user.id && r.organizationId === orgId)
      .map((r) => ({
        organizationId: r.organizationId || "",
        roleId: r.roleId || "",
      }));

    const profile = allUserProfiles.find((p) => p.userId === user.id);
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
