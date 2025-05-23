"use client";

import {
  BarChart3,
  LayoutDashboard,
  Package,
  Settings,
  Shield,
  ShieldUser,
  ShoppingCart,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import {usePathname} from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {OrganizationSwitcher} from "./organization-switcher";
import {UserNav} from "./user-nav";

export function DashboardSidebar() {
  const pathname = usePathname();

  const mainNavItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Profile",
      href: "/dashboard/profile",
      icon: User,
    },
    {
      title: "Roles",
      href: "/dashboard/roles",
      icon: ShieldUser,
      disabled: true,
    },
    {
      title: "Orders",
      href: "/dashboard/orders",
      icon: ShoppingCart,
      disabled: true,
    },
    {
      title: "Products",
      href: "/dashboard/products",
      icon: Package,
      disabled: true,
    },
    {
      title: "Customers",
      href: "/dashboard/customers",
      icon: Users,
      disabled: true,
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart3,
      disabled: true,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
      disabled: true,
    },
  ];

  const orgNavItems = [
    {
      title: "Members",
      href: "/dashboard/organization/members",
      icon: Users,
      // disabled: true,
    },
    {
      title: "Settings",
      href: "/dashboard/organization/settings",
      icon: Settings,
      disabled: true,
    },
  ];

  const DEVNavItems = [
    {
      title: "Organizations",
      href: "/dashboard/dev/organizations",
      icon: Shield,
      disabled: false,
    },
    {
      title: "Users",
      href: "/dashboard/dev/users",
      icon: Users,
      disabled: true,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-2">
        <OrganizationSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.title}
                  >
                    <Link href={item.href} aria-disabled={item.disabled}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Organization</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {orgNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.title}
                  >
                    <Link href={item.href} aria-disabled={item.disabled}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Developer</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {DEVNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.title}
                  >
                    <Link href={item.href} aria-disabled={item.disabled}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <UserNav />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
