import {users} from "@/drizzle/schema/users";
import {db} from "@/lib/db";
import {sendResetPasswordEmail} from "@/lib/email/sendResetPasswordEmail";
import crypto from "crypto";
import {eq} from "drizzle-orm";
import {NextResponse} from "next/server";

export async function POST(req: Request) {
  const {email} = await req.json();

  if (!email) {
    return NextResponse.json({error: "Email required"}, {status: 400});
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .then((res) => res[0]);

  if (!user) {
    return NextResponse.json({error: "User not found"}, {status: 404});
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes

  await db
    .update(users)
    .set({resetPasswordToken: token, resetPasswordExpires: expires})
    .where(eq(users.id, user.id));

  await sendResetPasswordEmail(email, token);

  return NextResponse.json({success: true});
}
