'use client';

import { useState } from 'react';
import { DashboardSidebar } from '@/components/dashboard/sidebar/Sidebar';
import { DashboardHeader } from '@/components/dashboard/header/Header';
import { DashboardMobileSidebar } from '@/components/dashboard/mobile-sidebar/MobileSidebar';
import { useAuthReady } from '@/components/providers/auth-provider/AuthProvider';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAuthReady = useAuthReady();

  if (!isAuthReady) return null;

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 border-r border-border bg-sidebar">
        <DashboardSidebar />
      </aside>

      {/* Mobile Sidebar */}
      <DashboardMobileSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto">
          <div className="h-full bg-gradient-to-b from-background to-background/95">{children}</div>
        </main>
      </div>
    </div>
  );
}
