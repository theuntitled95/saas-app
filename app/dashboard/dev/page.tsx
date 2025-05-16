"use client";

import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Building2Icon, Users2} from "lucide-react";
import Link from "next/link";

export default function DevDashboardPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-muted px-4">
      <Card className="w-full max-w-xl shadow-lg">
        <CardHeader>
          <CardTitle>Welcome, Developer!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-muted-foreground">
            This is your DEV dashboard landing page. Here you can access
            developer tools, view API logs, and manage your development
            environment.
          </p>
          <div className="flex flex-col gap-3">
            <Button variant="outline" className="w-full">
              View API Logs
            </Button>
            <Button variant="outline" className="w-full">
              Manage Environments
            </Button>
            <Button variant="outline" className="w-full">
              Access Documentation
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard/dev/organizations">
                <Building2Icon className="mr-2 h-4 w-4" />
                Organizations
              </Link>
            </Button>
            <Button variant="outline" className="w-full" disabled>
              <Link href="/dashboard/dev/users" className="flex">
                <Users2 className="mr-2 h-4 w-4" />
                Users
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
