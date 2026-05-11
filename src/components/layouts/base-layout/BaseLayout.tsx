'use client';

import { useState } from 'react';
import { Layout, Menu, Button, Drawer, Space, Badge, Avatar, Dropdown } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  CodeOutlined,
  ProjectOutlined,
  FileTextOutlined,
  BookOutlined,
  MessageOutlined,
  BarChartOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
  SearchOutlined,
  SunOutlined,
  MoonOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { Language } from '@/enums/language.enum';
import { useRouter, usePathname } from '@/i18n/navigation';

const { Header, Sider, Content } = Layout;

interface BaseLayoutProps {
  children: React.ReactNode;
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

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: t('nav.dashboard'),
    },
    {
      key: '/users',
      icon: <UserOutlined />,
      label: t('nav.users'),
    },
    {
      key: '/subscribers',
      icon: <TeamOutlined />,
      label: t('nav.subscribers'),
    },
    {
      key: '/skills',
      icon: <CodeOutlined />,
      label: t('nav.skills'),
    },
    {
      key: '/projects',
      icon: <ProjectOutlined />,
      label: t('nav.projects'),
    },
    {
      key: '/blogs',
      icon: <FileTextOutlined />,
      label: t('nav.blogs'),
    },
    {
      key: '/docs',
      icon: <BookOutlined />,
      label: t('nav.docs'),
    },
    {
      key: '/messages',
      icon: <MessageOutlined />,
      label: t('nav.messages'),
    },
    {
      key: '/analytics',
      icon: <BarChartOutlined />,
      label: t('nav.analytics'),
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: t('nav.settings'),
    },
    {
      type: 'divider' as const,
    },
    {
      key: '/logout',
      icon: <LogoutOutlined />,
      label: t('nav.logout'),
    },
  ];

  const handleMenuClick = (key: string) => {
    setDrawerOpen(false);
    if (key !== '/logout') {
      router.push(key);
    }
  };

  const currentKey = pathname || '/dashboard';

  return (
    <Layout className="h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={260}
        className="hidden md:block overflow-hidden border-r border-neutral-200 dark:border-neutral-800"
      >
        <div className="flex flex-col h-full overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-16 shrink-0 flex items-center gap-3 px-4 border-b border-neutral-200 dark:border-neutral-800"
          >
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-sky-600 to-sky-400 flex items-center justify-center text-white font-bold text-lg">
              P
            </div>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
              >
                <div className="text-gray-900 dark:text-white font-semibold">Portfolio</div>
                <div className="text-xs text-gray-500 dark:text-neutral-400">CMS Admin</div>
              </motion.div>
            )}
          </motion.div>

          <div className="flex-1 overflow-y-auto">
            <Menu
              theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
              mode="inline"
              selectedKeys={[currentKey]}
              onClick={(e) => handleMenuClick(e.key)}
              items={menuItems}
              className="border-0"
            />
          </div>

          <div className="shrink-0 border-t border-neutral-200 dark:border-neutral-800 p-2">
            <Button
              type="text"
              block
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="text-neutral-500 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100"
              size="large"
            />
          </div>
        </div>
      </Sider>

      {/* Mobile Drawer */}
      <Drawer
        title={t('drawer.title')}
        placement="left"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        className="md:hidden"
      >
        <Menu
          theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
          mode="inline"
          selectedKeys={[currentKey]}
          onClick={(e) => handleMenuClick(e.key)}
          items={menuItems}
          className="border-0"
        />
      </Drawer>

      <Layout className="overflow-auto flex-1">
        {/* Header */}
        <Header className="sticky top-0 z-40 border-b border-neutral-200 dark:border-neutral-800 px-4! md:px-8! flex items-center justify-between">
          <div className="md:hidden">
            <Button
              type="text"
              icon={<MenuFoldOutlined />}
              onClick={() => setDrawerOpen(true)}
              className="text-neutral-500 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100"
              size="large"
            />
          </div>

          <Space size="middle" className="flex items-center ml-auto">
            <Button
              type="text"
              icon={<SearchOutlined />}
              className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
            />
            <Badge count={3} size="small" offset={[-2, 4]}>
              <Button
                type="text"
                icon={<BellOutlined />}
                className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
              />
            </Badge>

            <Button
              type="text"
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              icon={resolvedTheme === 'dark' ? <SunOutlined /> : <MoonOutlined />}
              className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
            />

            <Dropdown
              menu={{
                selectedKeys: [locale],
                items: [
                  { key: Language.En, label: 'English' },
                  { key: Language.Vi, label: 'Tiếng Việt' },
                ],
                onClick: ({ key }) => handleLocaleChange(key as Language),
              }}
              placement="bottomRight"
            >
              <Button
                type="text"
                icon={<GlobalOutlined />}
                className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
              >
                <span className="text-xs font-medium uppercase">{locale}</span>
              </Button>
            </Dropdown>

            <Dropdown
              menu={{
                items: [
                  {
                    key: 'profile',
                    label: t('user.profile'),
                  },
                  {
                    key: 'update-password',
                    label: t('user.update_password'),
                  },
                  {
                    type: 'divider' as const,
                  },
                  {
                    key: 'logout',
                    label: t('user.logout'),
                    danger: true,
                  },
                ],
              }}
              placement="bottomRight"
            >
              <Avatar
                size={40}
                icon={<UserOutlined />}
                className="bg-sky-600 cursor-pointer hover:bg-sky-700 transition-colors"
              />
            </Dropdown>
          </Space>
        </Header>

        {/* Main Content */}
        <Content className="p-4 md:p-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {children}
          </motion.div>
        </Content>
      </Layout>
    </Layout>
  );
}
