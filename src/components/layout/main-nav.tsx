
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Router,
  Wrench,
  Users,
  Bell,
  BarChart3, // Added BarChart3
  type LucideIcon,
} from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  tooltip: string;
}

const navItems: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, tooltip: "Dashboard" },
  { href: "/devices", label: "Devices", icon: Router, tooltip: "Device Management" },
  { href: "/maintenance", label: "Maintenance", icon: Wrench, tooltip: "Predictive Maintenance" },
  { href: "/access-control", label: "Access Control", icon: Users, tooltip: "User Access Control" },
  { href: "/alerts", label: "Alerts", icon: Bell, tooltip: "Alerts & Notifications" },
  { href: "/analytics", label: "Analytics", icon: BarChart3, tooltip: "Reports & Analytics" }, // New Nav Item
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href} passHref legacyBehavior>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))}
              tooltip={item.tooltip}
              className={cn(
                "justify-start",
                (pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href)))
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <a>
                <item.icon className="h-5 w-5" />
                <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
              </a>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
