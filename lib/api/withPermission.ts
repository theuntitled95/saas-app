import {getSessionFromRequest} from "@/lib/auth/session";
import {hasPermission} from "@/lib/rbac/hasPermission";
import {cookies} from "next/headers";
import {NextResponse} from "next/server";

// permissions: string | string[]
// orgId?: string
export function withPermission(
  handler: (req: Request, ...args: unknown[]) => Promise<unknown>,
  permissions: string | string[],
  orgIdParam?: string
) {
  return async (req: Request, ...args: unknown[]) => {
    // Get user session
    const cookieStore = await cookies();
    const session = await getSessionFromRequest({cookies: cookieStore});
    if (!session?.userId) {
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    // Use orgIdParam if provided (for org-scoped checks)
    let orgId =
      orgIdParam ||
      (req instanceof Request
        ? new URL(req.url).searchParams.get("orgId")
        : undefined);
    orgId = orgId ?? undefined; // Convert null to undefined

    const has = await hasPermission(session.userId, permissions, orgId);
    if (!has) {
      return NextResponse.json({error: "Forbidden"}, {status: 403});
    }

    return handler(req, ...args);
  };
}
