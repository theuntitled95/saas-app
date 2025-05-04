import type React from "react";

import {Breadcrumbs} from "@/components/breadcrumbs";
import {DashboardSidebar} from "@/components/dashboard-sidebar";
import {Separator} from "@/components/ui/separator";
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {ModeToggle} from "@/components/ui/theme-switcher";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        <div className="flex-1">
          <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
            <SidebarTrigger />
            <Separator orientation="vertical" className="!h-6" />
            <div className="flex items-center">
              <Breadcrumbs />
            </div>
            <div className="ml-auto">
              <ModeToggle />
              {/* You can add user profile, notifications, etc. here */}
            </div>
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
