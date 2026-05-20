'use client';

import { useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Avatar from '@radix-ui/react-avatar';
import * as Dialog from '@radix-ui/react-dialog';
import {
  LayoutDashboard,
  Users,
  User,
  Code2,
  FolderKanban,
  FileText,
  BookOpen,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Search,
  Sun,
  Moon,
  Globe,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
} from 'lucide-react';
import { useTheme } from '@/components/providers/theme-provider/ThemeProvider';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { Language } from '@/enums/language.enum';
import { useRouter, usePathname } from '@/i18n/navigation';
import clsx from 'clsx';

interface BaseLayoutProps {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { key: '/dashboard', icon: LayoutDashboard, labelKey: 'nav.dashboard' },
  { key: '/users', icon: User, labelKey: 'nav.users' },
  { key: '/subscribers', icon: Users, labelKey: 'nav.subscribers' },
  { key: '/skills', icon: Code2, labelKey: 'nav.skills' },
  { key: '/projects', icon: FolderKanban, labelKey: 'nav.projects' },
  { key: '/blogs', icon: FileText, labelKey: 'nav.blogs' },
  { key: '/docs', icon: BookOpen, labelKey: 'nav.docs' },
  { key: '/messages', icon: MessageSquare, labelKey: 'nav.messages' },
  { key: '/analytics', icon: BarChart3, labelKey: 'nav.analytics' },
  { key: '/settings', icon: Settings, labelKey: 'nav.settings' },
] as const;

function NavMenu({
  currentKey,
  onSelect,
  collapsed,
}: {
  currentKey: string;
  onSelect: (key: string) => void;
  collapsed?: boolean;
}) {
  const t = useTranslations('layout');

  return (
    <nav className="flex-1 overflow-y-auto py-2">
      <ul className="space-y-0.5 px-2">
        {NAV_ITEMS.map(({ key, icon: Icon, labelKey }) => (
          <li key={key}>
            <button
              onClick={() => onSelect(key)}
              className={clsx(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                currentKey === key
                  ? 'bg-sky-600 text-white'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100',
              )}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span>{t(labelKey)}</span>}
            </button>
          </li>
        ))}

        <li className="my-1 border-t border-neutral-200 dark:border-neutral-800" />

        <li>
          <button
            onClick={() => onSelect('/logout')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-neutral-600 dark:text-neutral-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400"
          >
            <LogOut size={18} className="shrink-0" />
            {!collapsed && <span>{t('nav.logout')}</span>}
          </button>
        </li>
      </ul>
    </nav>
  );
}

export function BaseLayout({ children }: BaseLayoutProps) {
  const t = useTranslations('layout');

  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const handleLocaleChange = (lang: Language) => {
    router.replace(pathname, { locale: lang });
  };

  const handleMenuClick = (key: string) => {
    setDrawerOpen(false);
    if (key !== '/logout') {
      router.push(key);
    }
  };

  const currentKey = pathname || '/dashboard';

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside
        className={clsx(
          'hidden md:flex flex-col border-r border-neutral-200 dark:border-neutral-800 transition-all duration-200 bg-slate-50 dark:bg-gray-900',
          collapsed ? 'w-[72px]' : 'w-[260px]',
        )}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="h-16 shrink-0 flex items-center gap-3 px-4 border-b border-neutral-200 dark:border-neutral-800"
        >
          <div className="w-10 h-10 shrink-0 rounded-lg bg-linear-to-br from-sky-600 to-sky-400 flex items-center justify-center text-white font-bold text-lg">
            P
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
            >
              <div className="text-gray-900 dark:text-white font-semibold whitespace-nowrap">Portfolio</div>
              <div className="text-xs text-gray-500 dark:text-neutral-400 whitespace-nowrap">CMS Admin</div>
            </motion.div>
          )}
        </motion.div>

        <NavMenu currentKey={currentKey} onSelect={handleMenuClick} collapsed={collapsed} />

        <div className="shrink-0 border-t border-neutral-200 dark:border-neutral-800 p-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center p-2 rounded-lg text-neutral-500 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      <Dialog.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50 md:hidden" />
          <Dialog.Content className="fixed left-0 top-0 z-50 h-full w-72 bg-slate-50 dark:bg-gray-900 shadow-xl md:hidden flex flex-col outline-none">
            <div className="flex items-center justify-between px-4 h-16 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
              <Dialog.Title className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-sky-600 to-sky-400 flex items-center justify-center text-white font-bold">
                  P
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">{t('drawer.title')}</span>
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="p-1 rounded text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                  <X size={18} />
                </button>
              </Dialog.Close>
            </div>
            <NavMenu currentKey={currentKey} onSelect={handleMenuClick} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-40 h-16 shrink-0 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-gray-900 flex items-center justify-between px-4 md:px-8">
          <button
            className="md:hidden p-2 rounded-lg text-neutral-500 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            onClick={() => setDrawerOpen(true)}
          >
            <Menu size={18} />
          </button>

          <div className="flex items-center gap-1 ml-auto">
            <button className="p-2 rounded-lg text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
              <Search size={18} />
            </button>

            <div className="relative">
              <button className="p-2 rounded-lg text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                <Bell size={18} />
              </button>
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                3
              </span>
            </div>

            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              {resolvedTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="flex items-center gap-1.5 px-2 py-2 rounded-lg text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-xs font-medium uppercase">
                  <Globe size={16} />
                  {locale}
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  align="end"
                  sideOffset={4}
                  className="z-50 min-w-[130px] rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-gray-900 p-1 shadow-lg"
                >
                  {(
                    [
                      { key: Language.En, label: 'English' },
                      { key: Language.Vi, label: 'Tiếng Việt' },
                    ] as const
                  ).map(({ key, label }) => (
                    <DropdownMenu.Item
                      key={key}
                      onSelect={() => handleLocaleChange(key)}
                      className={clsx(
                        'px-3 py-1.5 rounded text-sm cursor-pointer outline-none transition-colors',
                        locale === key
                          ? 'bg-sky-600 text-white'
                          : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800',
                      )}
                    >
                      {label}
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="focus:outline-none ml-1">
                  <Avatar.Root className="w-9 h-9 rounded-full bg-sky-600 hover:bg-sky-700 transition-colors cursor-pointer flex items-center justify-center">
                    <Avatar.Fallback className="text-white font-semibold text-sm">A</Avatar.Fallback>
                  </Avatar.Root>
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  align="end"
                  sideOffset={4}
                  className="z-50 min-w-[160px] rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-gray-900 p-1 shadow-lg"
                >
                  <DropdownMenu.Item
                    onSelect={() => {}}
                    className="px-3 py-1.5 rounded text-sm cursor-pointer outline-none text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    {t('user.profile')}
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    onSelect={() => {}}
                    className="px-3 py-1.5 rounded text-sm cursor-pointer outline-none text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    {t('user.update_password')}
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator className="my-1 h-px bg-neutral-200 dark:bg-neutral-700" />
                  <DropdownMenu.Item
                    onSelect={() => {}}
                    className="px-3 py-1.5 rounded text-sm cursor-pointer outline-none text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  >
                    {t('user.logout')}
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
