"use client";

import { Sidebar } from "./sidebar";
import { useUIStore } from "@/stores/ui-store";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { sidebarCollapsed } = useUIStore();

  return (
    <div className="min-h-screen">
      <Sidebar />
      <main
        className="min-h-screen transition-all duration-200"
        style={{ marginLeft: sidebarCollapsed ? 72 : 260 }}
      >
        {children}
      </main>
    </div>
  );
}
