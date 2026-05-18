'use client';

import Link from 'next/link';
import { usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LayoutDashboard,
  Users,
  Mail,
  Code2,
  FolderOpen,
  FileText,
  BookOpen,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  Zap,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

const MENU_SECTIONS = [
  {
    titleKey: 'sidebar.section_main',
    items: [
      { labelKey: 'nav.dashboard', href: '/dashboard', icon: LayoutDashboard },
      { labelKey: 'nav.users', href: '/dashboard/users', icon: Users },
      { labelKey: 'nav.subscribers', href: '/dashboard/subscribers', icon: Mail },
    ],
  },
  {
    titleKey: 'sidebar.section_content',
    items: [
      { labelKey: 'nav.skills', href: '/dashboard/skills', icon: Code2 },
      { labelKey: 'nav.projects', href: '/dashboard/projects', icon: FolderOpen },
      { labelKey: 'nav.blogs', href: '/dashboard/blogs', icon: FileText },
      { labelKey: 'nav.docs', href: '/dashboard/docs', icon: BookOpen },
    ],
  },
  {
    titleKey: 'sidebar.section_other',
    items: [
      { labelKey: 'nav.messages', href: '/dashboard/messages', icon: MessageSquare },
      { labelKey: 'nav.analytics', href: '/dashboard/analytics', icon: BarChart3 },
    ],
  },
  {
    titleKey: 'nav.settings',
    items: [{ labelKey: 'nav.settings', href: '/dashboard/settings', icon: Settings }],
  },
] as const;

export function DashboardSidebar() {
  const t = useTranslations('layout');
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-screen bg-sidebar">
      <div className="p-6 border-b border-sidebar-border">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="p-2 rounded-lg bg-primary text-primary-foreground group-hover:bg-primary/90 transition-colors">
            <Zap className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg">DevAdmin</span>
            <span className="text-xs text-muted-foreground">Portfolio CMS</span>
          </div>
        </Link>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-6 p-4">
          {MENU_SECTIONS.map((section) => (
            <div key={section.titleKey}>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3">
                {t(section.titleKey)}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

                  return (
                    <Link key={item.href} href={item.href}>
                      <Button
                        variant={isActive ? 'default' : 'ghost'}
                        className={cn(
                          'w-full justify-start gap-3 h-10 rounded-lg',
                          isActive && 'bg-primary/20 text-primary hover:bg-primary/30',
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{t(item.labelKey)}</span>
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-sidebar-border space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-10 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">{t('nav.logout')}</span>
        </Button>
      </div>
    </div>
  );
}
