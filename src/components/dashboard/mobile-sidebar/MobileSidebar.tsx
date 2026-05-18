'use client';

import { Sheet, SheetContent } from '@/components/ui/sheet';
import { DashboardSidebar } from '../sidebar/Sidebar';

interface MobileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DashboardMobileSidebar({ open, onOpenChange }: MobileSidebarProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-64 p-0 border-border">
        <div className="h-full overflow-y-auto">
          <DashboardSidebar />
        </div>
      </SheetContent>
    </Sheet>
  );
}
