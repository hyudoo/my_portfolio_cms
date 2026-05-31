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
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  Zap,
  List,
  Tag,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { logoutAction } from '@/actions/auth.action';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

type NavChild = {
  labelKey: string;
  href: string;
  icon: LucideIcon;
};

type NavItem = {
  labelKey: string;
  href: string;
  icon: LucideIcon;
  children?: NavChild[];
};

type MenuSection = {
  titleKey: string;
  items: NavItem[];
};

const MENU_SECTIONS: MenuSection[] = [
  {
    titleKey: 'layout.sidebar.section_main',
    items: [
      { labelKey: 'layout.nav.dashboard', href: '/dashboard', icon: LayoutDashboard },
      { labelKey: 'layout.nav.users', href: '/users', icon: Users },
      { labelKey: 'layout.nav.subscribers', href: '/subscribers', icon: Mail },
    ],
  },
  {
    titleKey: 'layout.sidebar.section_content',
    items: [
      { labelKey: 'layout.nav.skill_managements', href: '/skill-managements', icon: Code2 },
      {
        labelKey: 'layout.nav.project_managements',
        href: '/project-managements',
        icon: FolderOpen,
        children: [
          { labelKey: 'layout.nav.projects_list', href: '/project-managements/projects', icon: List },
          { labelKey: 'layout.nav.project_categories', href: '/project-managements/categories', icon: Tag },
        ],
      },
    ],
  },
  {
    titleKey: 'layout.sidebar.section_other',
    items: [
      { labelKey: 'layout.nav.messages', href: '/messages', icon: MessageSquare },
      { labelKey: 'layout.nav.analytics', href: '/analytics', icon: BarChart3 },
    ],
  },
  {
    titleKey: 'layout.sidebar.section_system',
    items: [
      { labelKey: 'layout.nav.general_setting', href: '/system/general-setting', icon: Settings },
      { labelKey: 'layout.nav.roles', href: '/system/roles', icon: ShieldCheck },
    ],
  },
];

export function DashboardSidebar() {
  const t = useTranslations();
  const pathname = usePathname();

  const defaultExpanded = MENU_SECTIONS.flatMap((s) => s.items)
    .filter((item) => item.children?.some((child) => pathname === child.href || pathname.startsWith(child.href + '/')))
    .map((item) => item.href);

  const [expanded, setExpanded] = useState<string[]>(defaultExpanded);

  const toggleExpanded = (href: string) => {
    setExpanded((prev) => (prev.includes(href) ? prev.filter((h) => h !== href) : [...prev, href]));
  };

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
                  const isGroupActive = pathname === item.href || pathname.startsWith(item.href + '/');

                  if (item.children) {
                    const isOpen = expanded.includes(item.href);
                    return (
                      <div key={item.href}>
                        <Button
                          variant="ghost"
                          onClick={() => toggleExpanded(item.href)}
                          className={cn(
                            'w-full flex items-center justify-between gap-3 h-10 rounded-lg px-3',
                            'text-sm',
                            isGroupActive && 'bg-primary/20 text-primary hover:bg-primary/30 hover:text-primary',
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="w-4 h-4" />
                            <span>{t(item.labelKey)}</span>
                          </div>
                          <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
                            <ChevronRight className="w-4 h-4" />
                          </motion.div>
                        </Button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              key="submenu"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2, ease: 'easeInOut' }}
                              style={{ overflow: 'hidden' }}
                            >
                              <div className="ml-3 pl-4 border-l border-border space-y-1 mt-1 pb-1">
                                {item.children.map((child) => {
                                  const ChildIcon = child.icon;
                                  const isActive = pathname === child.href;
                                  return (
                                    <Link key={child.href} href={child.href}>
                                      <Button
                                        variant={isActive ? 'default' : 'ghost'}
                                        className={cn(
                                          'w-full justify-start gap-3 h-9 rounded-lg',
                                          isActive && 'bg-primary/20 text-primary hover:bg-primary/30',
                                        )}
                                      >
                                        <ChildIcon className="w-3.5 h-3.5" />
                                        <span className="text-sm">{t(child.labelKey)}</span>
                                      </Button>
                                    </Link>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

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
          onClick={() => logoutAction()}
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">{t('layout.nav.logout')}</span>
        </Button>
      </div>
    </div>
  );
}
