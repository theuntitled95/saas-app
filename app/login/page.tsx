import {auth} from "@/auth";
import {LoginForm} from "@/components/auth/login-form";
import {redirect} from "next/navigation";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard"); // already logged in, redirect to dashboard
  }
  return (
    <div className="max-w-md mx-auto mt-20">
      <LoginForm />
      {/* <h2 className="text-2xl font-bold mb-4">Log in</h2> */}
    </div>
  );
}
