"use client";

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {useTransition} from "react";
import {toast} from "sonner";
import {ProfileFormValues} from "../profile-form-schema";

type ProfileAvatarCardProps = {
  defaultValues: Partial<ProfileFormValues>;
};

export default function ProfileAvatarCard({
  defaultValues,
}: ProfileAvatarCardProps) {
  const [isPending, startTransition] = useTransition();

  const handleSendVerification = () => {
    startTransition(async () => {
      try {
        const res = await fetch("/api/user/send-verification", {
          method: "POST",
        });

        if (res.ok) {
          toast.success("Verification email sent. Please check your inbox.");
        } else {
          toast.error("Failed to send verification email.");
        }
      } catch {
        toast.error("Something went wrong. Please try again.");
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Picture</CardTitle>
        <CardDescription>
          Your profile picture will be shown across the platform.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-4">
        <Avatar className="h-32 w-32">
          {defaultValues.avatarUrl ? (
            <AvatarImage src={defaultValues.avatarUrl} alt="Profile picture" />
          ) : (
            <AvatarFallback className="text-4xl">
              {defaultValues.firstName?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          )}
        </Avatar>

        <div className="text-center space-y-1">
          <h3 className="text-xl font-semibold">
            {`${defaultValues.firstName || ""} ${defaultValues.lastName || ""}`.trim() ||
              "Unnamed User"}
          </h3>

          <p className="text-sm text-muted-foreground">
            {defaultValues.email || "No email"}
          </p>

          <div className="flex items-center justify-center gap-2 pt-2">
            <Badge
              className={`font-bold rounded-full ${
                defaultValues.emailVerified
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {defaultValues.emailVerified ? "Verified" : "Not Verified"}
            </Badge>

            {!defaultValues.emailVerified && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleSendVerification}
                disabled={isPending}
                className={`cursor-pointer 
                ${isPending ? "opacity-50 pointer-events-none" : ""}
              `}
              >
                {isPending ? "Sending..." : "Verify Email"}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
