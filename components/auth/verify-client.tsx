"use client";

import {useRouter, useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import {toast} from "sonner";

export default function VerifyClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus("error");
        return;
      }

      const res = await fetch(`/api/auth/verify-email?token=${token}`);
      if (res.ok) {
        setStatus("success");
        toast.success("Email verified! You can now log in.");
        router.push("/login?verified=1");
      } else {
        setStatus("error");
        toast.error("Invalid or expired token.");
      }
    };

    verify();
  }, [token, router]);

  if (status === "verifying") return <p>Verifying your email...</p>;
  if (status === "error")
    return <p>Verification failed. Try again or contact support.</p>;

  return null;
}
