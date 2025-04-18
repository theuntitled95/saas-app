import {SignupForm} from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Create your account</h2>
      <SignupForm />
    </div>
  );
}
