import {users} from "@/drizzle/schema/users";
import {db} from "@/lib/db";
import bcrypt from "bcryptjs";
import {and, eq, gte} from "drizzle-orm";
import {NextResponse} from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  console.log("RESET REQUEST BODY:", body); // <-- Add this

  const {token, password} = body;

  if (!token || !password) {
    return NextResponse.json({error: "Invalid request"}, {status: 400});
  }

  const user = await db
    .select()
    .from(users)
    .where(
      and(
        eq(users.resetPasswordToken, token),
        gte(users.resetPasswordExpires, new Date())
      )
    )
    .then((res) => res[0]);

  if (!user) {
    return NextResponse.json(
      {error: "Invalid or expired token"},
      {status: 400}
    );
  }

  const hashed = await bcrypt.hash(password, 10);

  await db
    .update(users)
    .set({
      hashedPassword: hashed,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    })
    .where(eq(users.id, user.id));

  return NextResponse.json({success: true});
}
