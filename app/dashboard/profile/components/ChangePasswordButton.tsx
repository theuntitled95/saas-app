"use client";

import {Button} from "@/components/ui/button";
import {Loader2, MailCheck} from "lucide-react";
import {useState, useTransition} from "react";
import {toast} from "sonner";

interface ChangePasswordButtonProps {
  email: string;
}

export function ChangePasswordButton({email}: ChangePasswordButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);

  const handleSendReset = async () => {
    startTransition(async () => {
      try {
        const res = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({email}),
        });

        if (res.ok) {
          setSuccess(true);
          toast.success("Password reset email sent!");
        } else {
          toast.error("Failed to send password reset email. Please try again.");
        }
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong.");
      }
    });
  };

  return (
    <Button
      onClick={handleSendReset}
      variant={"outline"}
      disabled={isPending || success}
      className="w-full sm:w-auto cursor-pointer"
    >
      {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {!isPending && success && <MailCheck className="mr-2 h-4 w-4" />}
      {isPending
        ? "Sending..."
        : success
          ? "Email Sent!"
          : "Send Password Reset Email"}
    </Button>
  );
}
