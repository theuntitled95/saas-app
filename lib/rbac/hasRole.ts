import {db} from "@/lib/db";

export async function hasRole({
  userId,
  organizationId,
  roleName,
}: {
  userId: string;
  organizationId: string;
  roleName: string;
}) {
  const result = await db.query.userOrganizationRoles.findFirst({
    where: (r, {eq, and}) =>
      and(eq(r.userId, userId), eq(r.organizationId, organizationId)),
    with: {
      role: true,
    },
  });

  return result?.role?.name === roleName;
}
