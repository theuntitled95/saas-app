"use client";

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useRouter, useSearchParams} from "next/navigation";
import {useState} from "react";
import {toast} from "sonner";

export default function ResetForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  console.log("reset token", token); // debug
  const router = useRouter();
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({token, password}),
      headers: {"Content-Type": "application/json"},
    });

    if (res.ok) {
      toast.success("Password reset. You can now log in.");
      router.push("/login");
    } else {
      toast.error("Invalid or expired token.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="password"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button type="submit" className="w-full">
        Reset Password
      </Button>
    </form>
  );
}
