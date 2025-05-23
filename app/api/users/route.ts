import {userOrganizationRoles, userProfiles, users} from "@/drizzle/schema";
import {getSessionFromRequest} from "@/lib/auth/session";
import {db} from "@/lib/db";
import {hasPermission} from "@/lib/rbac/hasPermission";
import {NextRequest, NextResponse} from "next/server";

export async function GET(req: NextRequest) {
  const cookieStore = req.cookies;
  const session = await getSessionFromRequest({cookies: cookieStore});
  if (!session?.userId) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }
  const isDEV = await hasPermission(session.userId, "view:users_all");
  if (!isDEV) {
    return NextResponse.json({error: "Forbidden"}, {status: 403});
  }

  const allUsers = await db.select().from(users);
  const allUserProfiles = await db.select().from(userProfiles);
  const roleAssignments = await db.select().from(userOrganizationRoles);

  const usersWithRoles = allUsers.map((user) => {
    const roles = roleAssignments
      .filter((r) => r.userId === user.id)
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
