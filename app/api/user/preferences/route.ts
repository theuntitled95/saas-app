import {userProfiles} from "@/drizzle/schema/user_profiles";
import {getSessionFromRequest} from "@/lib/auth/session";
import {db} from "@/lib/db";
import {eq} from "drizzle-orm";
import {cookies} from "next/headers";
import {NextResponse} from "next/server";

export async function PATCH(req: Request) {
  const session = await getSessionFromRequest({cookies: cookies()});
  if (!session?.userId) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  const data = await req.json();
  const {language, timezone} = data;

  await db
    .update(userProfiles)
    .set({language, timezone})
    .where(eq(userProfiles.userId, session.userId));

  return NextResponse.json({success: true});
}
