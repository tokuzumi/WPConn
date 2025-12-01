"use client";

import React, { useEffect, useState } from "react";
import { Bell, Menu, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  className?: string;
}

export function DashboardHeader({ className }: DashboardHeaderProps) {
  const { logout, user } = useAuth();
  const [apiStatus, setApiStatus] = useState<"online" | "offline" | "checking">("checking");

  useEffect(() => {
    const checkStatus = async () => {
      try {
        let API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
        // Force HTTPS if page is loaded over HTTPS
        if (window.location.protocol === 'https:' && API_URL.startsWith('http://')) {
          API_URL = API_URL.replace('http://', 'https://');
        }
        const healthUrl = API_URL.replace('/api/v1', '') + '/health';
        const res = await fetch(healthUrl);
        if (res.ok) {
          setApiStatus("online");
        } else {
          setApiStatus("offline");
        }
      } catch (error) {
        setApiStatus("offline");
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm",
        className
      )}
    >
      <nav className="h-16 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
            </div>

            <div className="hidden md:block lg:ms-6">
              {/* Search removed */}
            </div>

            <div className="flex items-center gap-x-1 md:gap-x-3">
              <div className="hidden md:flex items-center gap-x-2 mr-2">
                <span className="relative flex h-2.5 w-2.5">
                  {apiStatus === "online" && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  )}
                  <span className={cn(
                    "relative inline-flex rounded-full h-2.5 w-2.5",
                    apiStatus === "online" ? "bg-green-500" :
                      apiStatus === "offline" ? "bg-red-500" : "bg-yellow-500"
                  )}></span>
                </span>
                <span className="text-sm font-medium text-muted-foreground">
                  Status: {apiStatus === "online" ? "on-line" : apiStatus === "offline" ? "off-line" : "verificando..."}
                </span>
              </div>
              <ThemeToggle />
              <Button variant="ghost" size="icon" className="size-9.5 rounded-full">
                <Bell className="h-4 w-4" />
                <span className="sr-only">Notificações</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative size-8 rounded-full">
                    <Avatar className="size-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user?.username?.substring(0, 2).toUpperCase() || "AD"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-60" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.username || "Admin"}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.username || "admin@wpconn.com"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </nav>
        </header>
        );
}