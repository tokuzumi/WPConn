"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Circle, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { sidebarNavItems } from "./sidebar-nav";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";

interface DashboardSidebarProps {
  isMobile?: boolean;
}

export function DashboardSidebar({ isMobile = false }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div
      className={cn(
        "flex flex-col h-full border-r bg-sidebar",
        !isMobile && "fixed inset-y-0 start-0 z-30 w-65 hidden lg:block",
        isMobile && "w-full"
      )}
    >
      <div className="px-6 flex items-center h-16 border-b">
        <a href="#" className="flex-none text-xl inline-block font-semibold text-foreground">
          WPConn Dashboard
        </a>
      </div>

      <nav className="h-full overflow-y-auto p-3">
        <ul className="flex flex-col space-y-1">
          {sidebarNavItems.map((item, index) => {
            const Icon = item.icon || Circle;
            const isActive = pathname === item.href;
            return (
              <li key={index}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary font-medium dark:bg-primary/20"
                      : "text-muted-foreground hover:bg-muted/50 dark:hover:bg-muted/50"
                  )}
                >
                  <Icon className="shrink-0 size-4" />
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-3 border-t mt-auto">
        <Button
          variant="ghost"
          className="w-full justify-start gap-x-3.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
          onClick={logout}
        >
          <LogOut className="shrink-0 size-4" />
          Sair
        </Button>
      </div>
    </div>
  );
}