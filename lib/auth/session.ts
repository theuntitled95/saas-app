import jwt from "jsonwebtoken";
import {getToken} from "next-auth/jwt";
import type {ReadonlyRequestCookies} from "next/dist/server/web/spec-extension/adapters/request-cookies";
import {cookies as nextCookies} from "next/headers";

const TOKEN_NAME = "session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function createSessionCookie(userId: string): string {
  return jwt.sign({userId}, process.env.JWT_SECRET!, {expiresIn: MAX_AGE});
}

export function verifySessionCookie(token: string): {userId: string} | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as {userId: string};
  } catch {
    return null;
  }
}

export function setSessionCookie(token: string, res: Response | any) {
  res.cookies.set(TOKEN_NAME, token, {
    path: "/",
    httpOnly: true,
    maxAge: MAX_AGE,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export function destroySession(res: Response | any) {
  res.cookies.set(TOKEN_NAME, "", {
    path: "/",
    httpOnly: true,
    maxAge: 0,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function getSessionFromRequest({
  cookies,
}: {
  cookies?: ReadonlyRequestCookies | Promise<ReadonlyRequestCookies>;
} = {}): Promise<{userId: string} | null> {
  const cookieStore =
    cookies && typeof (cookies as {get?: unknown})?.get === "function"
      ? (cookies as ReadonlyRequestCookies)
      : ((await cookies) ?? nextCookies());

  const token = (await cookieStore).get(TOKEN_NAME)?.value;
  if (token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET!) as {userId: string};
    } catch {}
  }

  const nextAuthToken = await getToken({
    req: {headers: {cookie: cookieStore.toString()}},
    secret: process.env.AUTH_SECRET,
  });

  if (nextAuthToken?.sub) {
    return {userId: nextAuthToken.sub};
  }

  return null;
}
