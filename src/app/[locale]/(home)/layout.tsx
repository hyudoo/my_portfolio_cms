'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { DashboardSidebar } from '@/components/dashboard/sidebar/Sidebar';
import { DashboardHeader } from '@/components/dashboard/header/Header';
import { DashboardMobileSidebar } from '@/components/dashboard/mobile-sidebar/MobileSidebar';
import { useRouter } from '@/i18n/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  if (status !== 'authenticated') return null;

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
