'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Command } from '@/components/ui/command';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Bell, LogOut, Menu, Search, Settings, User } from 'lucide-react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { LanguageToggle } from './language-toggle/LanguageToggle';
import { ThemeToggle } from './theme-toggle/ThemeToggle';

export function DashboardHeader({ onSidebarToggle }: { onSidebarToggle: () => void }) {
  const t = useTranslations('layout');
  const [searchOpen, setSearchOpen] = useState(false);
  const [hasNotifications] = useState(true);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="flex items-center justify-between h-16 px-6 gap-4">
          <div className="flex items-center gap-4 flex-1 md:flex-initial">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={onSidebarToggle}>
              <Menu className="w-5 h-5" />
            </Button>

            <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={t('header.search_placeholder')}
                  className="pl-10 h-10 bg-sidebar border-border hover:bg-sidebar/80 transition-colors"
                  onClick={() => setSearchOpen(true)}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              {hasNotifications && <div className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />}
            </Button>

            <ThemeToggle />
            <LanguageToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center gap-3 px-3 py-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">Admin User</p>
                    <p className="text-xs text-muted-foreground">admin@portfolio.com</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  {t('user.profile')}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  {t('nav.settings')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  {t('user.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="overflow-hidden p-0 shadow-lg">
          <Command className="[&_[cmdk-input-wrapper]_svg]:hidden **:[[cmdk-input]]:border-0 **:[[cmdk-input]]:focus-visible:ring-0">
            <div className="flex items-center border-b border-border px-4">
              <Search className="w-4 h-4 text-muted-foreground mr-2" />
              <input
                placeholder={t('header.search_dialog_placeholder')}
                className="flex h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
            <div className="overflow-y-auto max-h-80 p-4 space-y-2">
              <p className="text-xs text-muted-foreground font-medium px-2 py-1.5">{t('header.quick_actions')}</p>
              <div className="text-sm cursor-pointer p-2 rounded-lg hover:bg-accent transition-colors">
                {t('header.new_user')}
              </div>
              <div className="text-sm cursor-pointer p-2 rounded-lg hover:bg-accent transition-colors">
                {t('header.new_project')}
              </div>
              <div className="text-sm cursor-pointer p-2 rounded-lg hover:bg-accent transition-colors">
                {t('header.new_blog_post')}
              </div>
            </div>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
