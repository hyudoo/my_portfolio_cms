'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Activity, ArrowUpRight, FileText, FolderOpen, Mail, Users } from 'lucide-react';
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useTranslations } from 'next-intl';

const chartData = [
  { name: 'Jan', users: 400, projects: 240 },
  { name: 'Feb', users: 520, projects: 290 },
  { name: 'Mar', users: 480, projects: 200 },
  { name: 'Apr', users: 690, projects: 390 },
  { name: 'May', users: 780, projects: 480 },
  { name: 'Jun', users: 890, projects: 490 },
];

const trafficData = [
  { name: 'Organic', value: 45, color: '#8b5cf6' },
  { name: 'Direct', value: 25, color: '#3b82f6' },
  { name: 'Referral', value: 20, color: '#10b981' },
  { name: 'Social', value: 10, color: '#f59e0b' },
];

const recentActivities = [
  { user: 'John Doe', action: 'Signed up', time: '2 hours ago' },
  { user: 'Admin', action: 'Published "React Best Practices"', time: '4 hours ago' },
  { user: 'Admin', action: 'Added new project "AI Dashboard"', time: '6 hours ago' },
  { user: 'Jane Smith', action: 'Commented on a blog post', time: '1 day ago' },
];

const latestBlogs = [
  { title: 'React Server Components', views: 1234, likes: 45, date: '2 days ago' },
  { title: 'Next.js 14 Features', views: 892, likes: 32, date: '4 days ago' },
  { title: 'TypeScript Tips', views: 756, likes: 28, date: '1 week ago' },
];

const recentSubscribers = [
  { name: 'Alex Chen', email: 'alex@example.com', date: '2 hours ago' },
  { name: 'Sarah Wilson', email: 'sarah@example.com', date: '4 hours ago' },
  { name: 'Michael Brown', email: 'michael@example.com', date: '1 day ago' },
];

export default function DashboardPage() {
  const t = useTranslations('dashboard');

  const stats = [
    {
      title: t('metrics.total_users'),
      value: '2,847',
      change: t('metrics.total_users_growth'),
      icon: Users,
      color: 'bg-blue-500/10 text-blue-500',
    },
    {
      title: t('metrics.total_subscribers'),
      value: '1,234',
      change: t('metrics.total_subscribers_growth'),
      icon: Mail,
      color: 'bg-purple-500/10 text-purple-500',
    },
    {
      title: t('metrics.total_projects'),
      value: '24',
      change: t('metrics.total_projects_growth'),
      icon: FolderOpen,
      color: 'bg-emerald-500/10 text-emerald-500',
    },
    {
      title: t('metrics.blog_views'),
      value: '156K',
      change: t('metrics.blog_views_growth'),
      icon: FileText,
      color: 'bg-orange-500/10 text-orange-500',
    },
  ];

  const systemStatus = [
    { label: t('system_status.api_server'), value: 95 },
    { label: t('system_status.database'), value: 98 },
    { label: t('system_status.storage'), value: 72 },
    { label: t('system_status.cache'), value: 99 },
  ];

  return (
    <div className="space-y-8 p-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="glass border-glass-border hover:border-primary/30 transition-colors">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <div className="flex items-center gap-1">
                      <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs font-medium text-emerald-500">{stat.change}</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass border-glass-border lg:col-span-2">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6">{t('charts.monthly_growth')}</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0.01 270)" />
                <XAxis dataKey="name" stroke="oklch(0.65 0 0)" />
                <YAxis stroke="oklch(0.65 0 0)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'oklch(0.12 0.01 270)',
                    border: '1px solid oklch(0.22 0.01 270)',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="oklch(0.65 0.28 270)" strokeWidth={2} />
                <Line type="monotone" dataKey="projects" stroke="oklch(0.55 0.22 200)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="glass border-glass-border">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6">{t('charts.traffic_overview')}</h2>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={trafficData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {trafficData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'oklch(0.12 0.01 270)',
                    border: '1px solid oklch(0.22 0.01 270)',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {trafficData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-semibold">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Activities + System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass border-glass-border lg:col-span-2">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">{t('recent_activities')}</h2>
              <Button variant="outline" size="sm">
                {t('view_all')}
              </Button>
            </div>
            <ScrollArea className="h-80">
              <div className="space-y-4 pr-4">
                {recentActivities.map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-4 pb-4 border-b border-border last:border-0">
                    <div className="p-2 rounded-lg bg-primary/10 mt-0.5">
                      <Activity className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.user}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </Card>

        <Card className="glass border-glass-border">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6">{t('system_status.title')}</h2>
            <div className="space-y-6">
              {systemStatus.map(({ label, value }) => (
                <div key={label}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{label}</span>
                    <Badge variant="default" className="bg-emerald-500/20 text-emerald-500 border-emerald-500/30">
                      {t('system_status.operational')}
                    </Badge>
                  </div>
                  <Progress value={value} className="h-1" />
                </div>
              ))}
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-3">{t('system_status.last_updated')}</p>
                <Button variant="outline" size="sm" className="w-full">
                  {t('system_status.view_details')}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Blog Posts + Subscribers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass border-glass-border">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">{t('latest_blog_posts.title')}</h2>
              <Button variant="outline" size="sm">
                {t('latest_blog_posts.view_all')}
              </Button>
            </div>
            <div className="space-y-4">
              {latestBlogs.map((blog, idx) => (
                <div key={idx} className="flex items-start justify-between pb-4 border-b border-border last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">{blog.title}</p>
                    <div className="flex gap-4 mt-2">
                      <span className="text-xs text-muted-foreground">
                        {blog.views} {t('latest_blog_posts.col_views').toLowerCase()}
                      </span>
                      <span className="text-xs text-muted-foreground">{blog.likes} likes</span>
                      <span className="text-xs text-muted-foreground">{blog.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="glass border-glass-border">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">{t('recent_subscribers.title')}</h2>
              <Button variant="outline" size="sm">
                {t('recent_subscribers.view_all')}
              </Button>
            </div>
            <div className="space-y-4">
              {recentSubscribers.map((subscriber, idx) => (
                <div key={idx} className="flex items-center gap-3 pb-4 border-b border-border last:border-0">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${subscriber.name}`} />
                    <AvatarFallback>{subscriber.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{subscriber.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{subscriber.email}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{subscriber.date}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
