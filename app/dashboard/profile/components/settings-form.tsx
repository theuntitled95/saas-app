"use client";

import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Lock, ShieldCheck} from "lucide-react";
import {useState} from "react";
import {ChangePasswordButton} from "./ChangePasswordButton";

interface SettingsFormProps {
  email: string;
}

export default function SettingsForm({email}: SettingsFormProps) {
  const [is2FAEnabled] = useState(false); // TODO: Placeholder, integrate later

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Change Password
          </CardTitle>
          <CardDescription>
            Send yourself an email to reset your account password securely.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            You will receive a password reset link via email.
          </p>
        </CardContent>
        <CardFooter>
          <ChangePasswordButton email={email} />
        </CardFooter>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            Two-Factor Authentication (2FA)
          </CardTitle>
          <CardDescription>
            Add an extra layer of security to your account. (Coming soon)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {is2FAEnabled ? (
            <p className="text-sm text-emerald-600">
              2FA is enabled on your account.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Two-Factor Authentication is not enabled yet.
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button disabled variant="outline">
            Setup 2FA (Coming Soon)
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
