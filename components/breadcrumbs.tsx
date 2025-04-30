"use client";

import {ChevronRight, Home} from "lucide-react";
import {usePathname} from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function Breadcrumbs() {
  const pathname = usePathname();

  // Don't render breadcrumbs on the main dashboard page
  if (pathname === "/dashboard") {
    return null;
  }

  // Split the pathname into segments and remove empty segments
  const segments = pathname.split("/").filter(Boolean);

  // Create breadcrumb items based on the segments
  const breadcrumbItems = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    const isLast = index === segments.length - 1;

    // Format the segment for display (capitalize first letter, replace hyphens with spaces)
    const formattedSegment = segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

    return {
      href,
      label: formattedSegment,
      isLast,
    };
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">
            <Home className="h-4 w-4" />
            <span className="sr-only">Dashboard</span>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <ChevronRight className="h-4 w-4" />
        </BreadcrumbSeparator>

        {breadcrumbItems.map((item) => (
          <BreadcrumbItem key={item.href}>
            {item.isLast ? (
              <BreadcrumbPage>{item.label}</BreadcrumbPage>
            ) : (
              <>
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
              </>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
