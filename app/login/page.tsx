import {LoginForm} from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Log in</h2>
      <LoginForm />
    </div>
  );
}
