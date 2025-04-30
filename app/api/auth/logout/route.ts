import {destroySession} from "@/lib/auth/session";
import {NextResponse} from "next/server";

export async function POST() {
  const response = NextResponse.redirect(
    new URL("/login", process.env.NEXT_PUBLIC_APP_URL)
  );

  // Destroy our custom email/password login session
  destroySession(response);

  // Clear NextAuth (OAuth) session cookie for non-secure
  response.cookies.set("next-auth.session-token", "", {
    path: "/",
    maxAge: 0,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  // Clear NextAuth (OAuth) session cookie for secure (for production)
  response.cookies.set("__Secure-next-auth.session-token", "", {
    path: "/",
    maxAge: 0,
    httpOnly: true,
    sameSite: "lax",
    secure: true, // Always true because "__Secure-" prefix requires it
  });

  return response;
}
