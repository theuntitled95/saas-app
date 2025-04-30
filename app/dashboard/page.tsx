import {LogoutButton} from "@/components/auth/logout-button";
import {Button} from "@/components/ui/button";
import {getSessionFromRequest} from "@/lib/auth/session";
// import {signOut} from "next-auth/react";
import {cookies} from "next/headers";
import Link from "next/link";
import {redirect} from "next/navigation";

export default async function DashboardPage() {
  const cookiesData = await cookies();
  const session = await getSessionFromRequest({cookies: cookiesData});

  if (!session?.userId) {
    redirect("/login");
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome to your dashboard 🎉</h1>
      <p>User ID: {session.userId}</p>
      <Button asChild variant={"link"}>
        <Link href="/forgot-password">Forgot Password</Link>
      </Button>
      {/* <Button
        onClick={() => signOut({callbackUrl: "/login"})}
        variant="destructive"
      >
        Sign Out
      </Button> */}
      <LogoutButton />
    </div>
  );
}
