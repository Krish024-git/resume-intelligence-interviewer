"use client";

import { Bell, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUIStore } from "@/stores/ui-store";

interface HeaderProps {
  title: string;
  description?: string;
}

export function Header({ title, description }: HeaderProps) {
  const { sidebarCollapsed } = useUIStore();

  return (
    <header
      className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/50 bg-sidebar/60 px-6 backdrop-blur-xl"
      style={{ marginLeft: sidebarCollapsed ? 72 : 260 }}
    >
      <div>
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search interviews..."
            className="w-64 pl-9 bg-card/10"
          />
        </div>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
        </Button>

        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" />
            <AvatarFallback className="text-xs">AI</AvatarFallback>
          </Avatar>
          <div className="hidden lg:block">
            <p className="text-sm font-medium">Interview Practice</p>
            <p className="text-xs text-muted-foreground">Local session</p>
          </div>
        </div>
      </div>
    </header>
  );
}
