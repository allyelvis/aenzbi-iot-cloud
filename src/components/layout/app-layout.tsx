
"use client";
import type React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarRail,
} from "@/components/ui/sidebar";
import { MainNav } from "./main-nav";
import { Logo } from "./logo";
import { UserNav } from "./user-nav";
import { Separator } from '../ui/separator';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';


export function AppLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  // Default to true for desktop, false for mobile to start with sidebar closed on mobile
  const defaultOpen = typeof window !== 'undefined' ? window.innerWidth >= 768 : true;

  return (
    <SidebarProvider defaultOpen={defaultOpen} open={isMobile ? false: undefined}>
      <Sidebar collapsible={isMobile ? "offcanvas" : "icon"} variant="sidebar" side="left">
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <Separator className="bg-sidebar-border" />
        <SidebarContent>
          <MainNav />
        </SidebarContent>
        <Separator className="bg-sidebar-border" />
        <SidebarFooter>
          {/* Can add footer items here if needed */}
        </SidebarFooter>
        {!isMobile && <SidebarRail />}
      </Sidebar>
      <SidebarInset>
        <div className={cn(
          "flex flex-col min-h-screen",
          // Add padding to the left to account for the icon-only sidebar when collapsed on desktop
          "md:peer-data-[state=collapsed]:peer-data-[collapsible=icon]:pl-[--sidebar-width-icon]" 
        )}>
          <UserNav />
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
