"use client";

import {
  CreditCard,
  LogOut,
  MoreVerticalIcon,
  Settings,
  User,
} from "lucide-react";
import {signOut} from "next-auth/react";
import Link from "next/link";
import {useEffect, useState, useTransition} from "react";
import {toast} from "sonner";

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type FetchedUser = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
};

export function UserNav() {
  const [user, setUser] = useState<FetchedUser | null>(null);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetch("/api/user/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setUser(data);
      })
      .catch(() => {});
  }, []);

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ""}`
    : "Unknown User";

  const displayEmail = user?.email || "No email";
  const displayImage = user?.avatarUrl;

  const initials = (() => {
    const first = user?.firstName?.charAt(0);
    const last = user?.lastName?.charAt(0);
    if (first || last) return `${first ?? ""}${last ?? ""}`.toUpperCase();
    return user?.email?.charAt(0).toUpperCase() ?? "U";
  })();

  const handleLogout = async () => {
    startTransition(async () => {
      try {
        await fetch("/api/auth/logout", {method: "POST"});
        await signOut({callbackUrl: "/login"});
        toast.success("Logged out successfully");
      } catch (error) {
        console.error("Logout error", error);
        toast.error("Logout failed. Please try again.");
      }
    });
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-auto w-full justify-start gap-2 px-2 py-1.5 text-left cursor-pointer"
        >
          <Avatar className="h-8 w-8">
            {displayImage ? (
              <AvatarImage src={displayImage} alt={displayName} />
            ) : (
              <AvatarFallback>{initials}</AvatarFallback>
            )}
          </Avatar>

          <div className="flex flex-1 flex-col space-y-0.5 text-left">
            <p className="text-sm font-medium truncate">{displayName}</p>
            <p className="text-xs text-muted-foreground truncate">
              {displayEmail}
            </p>
          </div>

          <MoreVerticalIcon className="ml-auto size-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-56"
        align="start"
        side="right"
        forceMount
      >
        <DropdownMenuLabel className="font-normal flex items-center space-x-2 gap-1">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none truncate">
              {displayName}
            </p>
            <p className="text-xs leading-none text-muted-foreground truncate">
              {displayEmail}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/profile">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isPending}
          className={isPending ? "opacity-50 pointer-events-none" : ""}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isPending ? "Logging out..." : "Log out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
