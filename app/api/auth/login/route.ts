import {users} from "@/drizzle/schema/users";
import {createSessionCookie, setSessionCookie} from "@/lib/auth/session";
import {db} from "@/lib/db";
import bcrypt from "bcryptjs";
import {eq} from "drizzle-orm";
import {NextRequest, NextResponse} from "next/server";

export async function POST(req: NextRequest) {
  try {
    const {email, password} = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        {error: "Missing email or password"},
        {status: 400}
      );
    }

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .then((res) => res[0]);

    if (!existingUser) {
      return NextResponse.json(
        {error: "Invalid email or password"},
        {status: 401}
      );
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.hashedPassword
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        {error: "Invalid email or password"},
        {status: 401}
      );
    }

    const token = createSessionCookie(existingUser.id);

    const response = NextResponse.json({success: true});
    setSessionCookie(token, response);

    return response;
  } catch (error) {
    console.error("[LOGIN_ERROR]", error);
    return NextResponse.json(
      {error: "Something went wrong. Please try again later."},
      {status: 500}
    );
  }
}
