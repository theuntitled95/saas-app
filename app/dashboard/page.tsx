import {Button} from "@/components/ui/button";
import {getSessionFromRequest} from "@/lib/auth/session";
import {cookies} from "next/headers";
import Link from "next/link";
import {redirect} from "next/navigation";

export default async function DashboardPage() {
  const session = getSessionFromRequest({cookies: await cookies()});

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
      <form action="/api/auth/logout" method="POST">
        <Button variant={"destructive"}>Logout</Button>
      </form>
    </div>
  );
}
