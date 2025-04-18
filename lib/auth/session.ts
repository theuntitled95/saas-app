import jwt from "jsonwebtoken";
import {ReadonlyRequestCookies} from "next/dist/server/web/spec-extension/adapters/request-cookies";

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

export function setSessionCookie(token: string, res: Response) {
  res.headers.append(
    "Set-Cookie",
    `${TOKEN_NAME}=${token}; Path=/; HttpOnly; Max-Age=${MAX_AGE}; SameSite=Lax; ${
      process.env.NODE_ENV === "production" ? "Secure;" : ""
    }`
  );
}

export function destroySession(res: Response) {
  res.headers.append(
    "Set-Cookie",
    `${TOKEN_NAME}=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax; ${
      process.env.NODE_ENV === "production" ? "Secure;" : ""
    }`
  );
}

export function getSessionFromRequest({
  cookies,
}: {
  cookies: ReadonlyRequestCookies;
}): {userId: string} | null {
  const token = cookies.get(TOKEN_NAME)?.value;
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as {userId: string};
  } catch {
    return null;
  }
}
