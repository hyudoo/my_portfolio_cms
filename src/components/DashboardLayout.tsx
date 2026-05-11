"use client";

import { useState } from "react";
import { Layout, Menu, Button, Drawer, Space, Badge, Avatar, Dropdown } from "antd";
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
} from "@ant-design/icons";
import { useTheme } from "next-themes";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

const { Header, Sider, Content } = Layout;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  // Handle hydration
  const handleMounted = () => {
    setMounted(true);
  };

  if (!mounted) {
    setTimeout(handleMounted, 0);
  }

  const menuItems = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "/dashboard/users",
      icon: <UserOutlined />,
      label: "Users",
    },
    {
      key: "/dashboard/subscribers",
      icon: <TeamOutlined />,
      label: "Subscribers",
    },
    {
      key: "/dashboard/skills",
      icon: <CodeOutlined />,
      label: "Skills",
    },
    {
      key: "/dashboard/projects",
      icon: <ProjectOutlined />,
      label: "Projects",
    },
    {
      key: "/dashboard/blogs",
      icon: <FileTextOutlined />,
      label: "Blogs",
    },
    {
      key: "/dashboard/docs",
      icon: <BookOutlined />,
      label: "Technical Docs",
    },
    {
      key: "/dashboard/messages",
      icon: <MessageOutlined />,
      label: "Messages",
    },
    {
      key: "/dashboard/analytics",
      icon: <BarChartOutlined />,
      label: "Analytics",
    },
    {
      key: "/dashboard/settings",
      icon: <SettingOutlined />,
      label: "Settings",
    },
    {
      type: "divider" as const,
    },
    {
      key: "/logout",
      icon: <LogoutOutlined />,
      label: "Logout",
    },
  ];

  const handleMenuClick = (key: string) => {
    setDrawerOpen(false);
    if (key !== "/logout") {
      router.push(key);
    }
  };

  const currentKey = pathname || "/dashboard";

  return (
    <Layout className="min-h-screen">
      {/* Desktop Sidebar */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={260}
        className="hidden md:block fixed left-0 top-0 bottom-0 border-r border-neutral-800"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 border-b border-neutral-800"
        >
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-600 to-violet-400 flex items-center justify-center text-white font-bold text-lg">
              P
            </div>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
              >
                <div className="text-white font-semibold">Portfolio</div>
                <div className="text-xs text-neutral-400">CMS Admin</div>
              </motion.div>
            )}
          </div>
        </motion.div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[currentKey]}
          onClick={(e) => handleMenuClick(e.key)}
          items={menuItems}
          className="border-0 bg-neutral-900"
        />
      </Sider>

      {/* Mobile Drawer */}
      <Drawer
        title="Navigation"
        placement="left"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        className="md:hidden"
      >
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[currentKey]}
          onClick={(e) => handleMenuClick(e.key)}
          items={menuItems}
          className="border-0"
        />
      </Drawer>

      <Layout className="md:ml-[260px]">
        {/* Header */}
        <Header className="sticky top-0 z-40 border-b border-neutral-800 px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:block text-neutral-300 hover:text-neutral-100"
              size="large"
            />
            <Button
              type="text"
              icon={<MenuFoldOutlined />}
              onClick={() => setDrawerOpen(true)}
              className="md:hidden text-neutral-300 hover:text-neutral-100"
              size="large"
            />
          </div>

          <Space size="middle" className="flex items-center">
            <Button
              type="text"
              icon={<SearchOutlined />}
              className="text-neutral-400 hover:text-neutral-100"
            />
            <Button
              type="text"
              icon={<BellOutlined />}
              className="text-neutral-400 hover:text-neutral-100 relative"
            >
              <Badge count={3} size="small" className="absolute -top-1 -right-1" />
            </Button>

            <Button
              type="text"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              icon={theme === "dark" ? <SunOutlined /> : <MoonOutlined />}
              className="text-neutral-400 hover:text-neutral-100"
            />

            <Dropdown
              menu={{
                items: [
                  {
                    key: "profile",
                    label: "Profile Settings",
                  },
                  {
                    key: "preferences",
                    label: "Preferences",
                  },
                  {
                    type: "divider" as const,
                  },
                  {
                    key: "logout",
                    label: "Logout",
                    danger: true,
                  },
                ],
              }}
              placement="bottomRight"
            >
              <Avatar
                size={40}
                icon={<UserOutlined />}
                className="bg-violet-600 cursor-pointer hover:bg-violet-700 transition-colors"
              />
            </Dropdown>
          </Space>
        </Header>

        {/* Main Content */}
        <Content className="p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </Content>
      </Layout>
    </Layout>
  );
}
