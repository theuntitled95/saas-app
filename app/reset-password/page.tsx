import ResetForm from "@/components/auth/reset-form";

export default function ResetPasswordPage() {
  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Reset your password</h2>
      <ResetForm />
    </div>
  );
}
