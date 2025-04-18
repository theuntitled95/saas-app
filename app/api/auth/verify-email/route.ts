import {users} from "@/drizzle/schema/users";
import {db} from "@/lib/db";
import {eq} from "drizzle-orm";
import {NextResponse} from "next/server";

export async function GET(req: Request) {
  const {searchParams} = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({error: "Missing token"}, {status: 400});
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.emailVerificationToken, token))
    .then((res) => res[0]);

  if (!user) {
    return NextResponse.json({error: "Invalid token"}, {status: 404});
  }

  await db
    .update(users)
    .set({emailVerified: true, emailVerificationToken: null})
    .where(eq(users.id, user.id));

  return NextResponse.json({success: true});
}
