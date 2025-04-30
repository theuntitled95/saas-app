import {users} from "@/drizzle/schema/users";
import {getSessionFromRequest} from "@/lib/auth/session";
import {db} from "@/lib/db";
import {sendVerificationEmail} from "@/lib/email/sendVerificationEmail";
import crypto from "crypto"; // <--- ADD THIS IMPORT!
import {eq} from "drizzle-orm";
import {cookies} from "next/headers";
import {NextResponse} from "next/server";

export async function POST() {
  const session = await getSessionFromRequest({cookies: await cookies()});

  if (!session?.userId) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, session.userId))
    .then((res) => res[0]);

  if (!user) {
    return NextResponse.json({error: "User not found"}, {status: 404});
  }

  if (user.emailVerified) {
    return NextResponse.json({error: "Email already verified"}, {status: 400});
  }

  // Generate random token
  const verificationToken = crypto.randomBytes(32).toString("hex");

  await db
    .update(users)
    .set({emailVerificationToken: verificationToken})
    .where(eq(users.id, user.id));

  await sendVerificationEmail(user.email, verificationToken);

  return NextResponse.json({success: true});
}
