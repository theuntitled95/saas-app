import {Button} from "@/components/ui/button";
import {getSessionFromRequest} from "@/lib/auth/session";
import {Metadata} from "next";
import {cookies} from "next/headers";
import Link from "next/link";
import {redirect} from "next/navigation";
import {ChangePasswordButton} from "./profile/components/ChangePasswordButton";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "User Dashboard",
};

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
      <ChangePasswordButton email={session.email} />
      <Button asChild variant={"link"}>
        <Link href="/forgot-password">Forgot Password</Link>
      </Button>
    </div>
  );
}
