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
  const {firstName, lastName, gender, phone, dateOfBirth, bio} = data;

  await db
    .update(userProfiles)
    .set({firstName, lastName, gender, phone, dateOfBirth, bio})
    .where(eq(userProfiles.userId, session.userId));

  return NextResponse.json({success: true});
}
