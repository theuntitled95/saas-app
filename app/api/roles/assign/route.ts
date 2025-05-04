import {userOrganizationRoles} from "@/drizzle/schema/user_organization_roles";
import {db} from "@/lib/db";
import {eq} from "drizzle-orm";
import {NextResponse} from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const {userId, organizationId, roleId} = body;

  if (!userId || !organizationId || !roleId) {
    return NextResponse.json({error: "Missing fields"}, {status: 400});
  }

  // Prevent duplicates
  const exists = await db.query.userOrganizationRoles.findFirst({
    where: (r) =>
      eq(r.userId, userId) &&
      eq(r.organizationId, organizationId) &&
      eq(r.roleId, roleId),
  });

  if (exists) {
    return NextResponse.json({error: "Role already assigned"}, {status: 409});
  }

  await db.insert(userOrganizationRoles).values({
    userId,
    organizationId,
    roleId,
  });

  return NextResponse.json({success: true});
}
