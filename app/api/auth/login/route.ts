import {users} from "@/drizzle/schema/users";
import {createSessionCookie, setSessionCookie} from "@/lib/auth/session";
import {db} from "@/lib/db";
import bcrypt from "bcryptjs";
import {eq} from "drizzle-orm";
import type {NextRequest} from "next/server";
import {NextResponse} from "next/server";

export async function POST(req: NextRequest) {
  const {email, password} = await req.json();

  if (!email || !password) {
    return NextResponse.json({error: "Missing credentials"}, {status: 400});
  }

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .then((res) => res[0]);

  if (!existingUser) {
    return NextResponse.json({error: "Invalid credentials"}, {status: 401});
  }

  const isMatch = await bcrypt.compare(password, existingUser.hashedPassword);

  if (!isMatch) {
    return NextResponse.json({error: "Invalid credentials"}, {status: 401});
  }

  const token = createSessionCookie(existingUser.id);

  const response = NextResponse.json({success: true});
  setSessionCookie(token, response);

  return response;
}
