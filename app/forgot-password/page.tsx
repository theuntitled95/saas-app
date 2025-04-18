import {ForgotPasswordForm} from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Forgot your password?</h2>
      <ForgotPasswordForm />
    </div>
  );
}
