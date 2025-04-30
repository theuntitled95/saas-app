import {userProfiles} from "@/drizzle/schema/user_profiles";
import {users} from "@/drizzle/schema/users";
import {getSessionFromRequest} from "@/lib/auth/session";
import {db} from "@/lib/db";
import {eq} from "drizzle-orm";
import {cookies} from "next/headers";
import {NextResponse} from "next/server";

export async function GET() {
  const session = await getSessionFromRequest({cookies: await cookies()});

  if (!session?.userId) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  const user = await db
    .select({
      id: users.id,
      email: users.email,
      emailVerified: users.emailVerified,
      firstName: userProfiles.firstName,
      lastName: userProfiles.lastName,
      gender: userProfiles.gender,
      dateOfBirth: userProfiles.dateOfBirth,
      phone: userProfiles.phone,
      avatarUrl: userProfiles.avatarUrl,
      bio: userProfiles.bio,
      language: userProfiles.language,
      timezone: userProfiles.timezone,
    })
    .from(users)
    .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
    .where(eq(users.id, session.userId))
    .then((res) => res[0]);

  if (!user) {
    return NextResponse.json({error: "User not found"}, {status: 404});
  }

  return NextResponse.json(user);
}

export async function PATCH(req: Request) {
  const session = await getSessionFromRequest({cookies: await cookies()});

  if (!session?.userId) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  const body = await req.json();

  const {
    firstName,
    lastName,
    gender,
    dateOfBirth,
    phone,
    avatarUrl,
    bio,
    language,
    timezone,
  } = body;

  try {
    const existingProfile = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, session.userId))
      .then((res) => res[0]);

    if (!existingProfile) {
      await db.insert(userProfiles).values({
        userId: session.userId,
        firstName,
        lastName,
        gender,
        dateOfBirth,
        phone,
        avatarUrl,
        bio,
        language,
        timezone,
      });
    } else {
      await db
        .update(userProfiles)
        .set({
          firstName,
          lastName,
          gender,
          dateOfBirth,
          phone,
          avatarUrl,
          bio,
          language,
          timezone,
        })
        .where(eq(userProfiles.userId, session.userId));
    }

    return NextResponse.json({success: true});
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}
