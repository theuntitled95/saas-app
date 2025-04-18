import {users} from "@/drizzle/schema/users";
import {db} from "@/lib/db";
import {sendVerificationEmail} from "@/lib/email/sendVerificationEmail";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import {eq} from "drizzle-orm";
import {NextResponse} from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {email, password} = body;

    if (!email || !password) {
      return NextResponse.json({error: "Missing fields"}, {status: 400});
    }

    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existing.length > 0) {
      return NextResponse.json(
        {error: "Email already registered"},
        {status: 409}
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db
      .insert(users)
      .values({
        email,
        hashedPassword,
      })
      .returning();

    // generate a random token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    await db
      .update(users)
      .set({
        emailVerificationToken: verificationToken,
      })
      .where(eq(users.email, email));

    await sendVerificationEmail(email, verificationToken);

    return NextResponse.json({user: newUser[0]}, {status: 201});
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({error: "Internal error"}, {status: 500});
  }
}
