"use client";

import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Timeline,
  Tag,
  Avatar,
  Space,
  Badge,
  Button,
  Progress,
} from "antd";
import {
  UserOutlined,
  TeamOutlined,
  ProjectOutlined,
  FileTextOutlined,
  YoutubeOutlined,
  ArrowUpOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const trafficData = [
  { date: "Jan 1", visitors: 2400, views: 2210 },
  { date: "Jan 5", visitors: 3210, views: 2290 },
  { date: "Jan 10", visitors: 2000, views: 9800 },
  { date: "Jan 15", visitors: 2780, views: 3908 },
  { date: "Jan 20", visitors: 1890, views: 4800 },
  { date: "Jan 25", visitors: 2390, views: 3800 },
  { date: "Jan 30", visitors: 3490, views: 4300 },
];

const growthData = [
  { month: "Jan", users: 400, subscribers: 240 },
  { month: "Feb", users: 520, subscribers: 350 },
  { month: "Mar", users: 680, subscribers: 520 },
  { month: "Apr", users: 750, subscribers: 680 },
  { month: "May", users: 890, subscribers: 780 },
  { month: "Jun", users: 1050, subscribers: 920 },
];

const recentBlogs = [
  { id: 1, title: "Building Modern Dashboards with Ant Design", views: 1240, date: "2 days ago" },
  { id: 2, title: "Next.js 14 Performance Tips", views: 980, date: "4 days ago" },
  { id: 3, title: "React Hooks Deep Dive", views: 2100, date: "1 week ago" },
];

const recentSubscribers = [
  { id: 1, email: "alice@example.com", date: "Today", status: "verified" },
  { id: 2, email: "bob@example.com", date: "Yesterday", status: "verified" },
  { id: 3, email: "charlie@example.com", date: "2 days ago", status: "pending" },
];

const activityTimeline = [
  { content: "New user registration: John Doe", time: "2 hours ago", status: "success" },
  { content: "Blog post published: React Hooks Guide", time: "4 hours ago", status: "success" },
  { content: "New subscriber: jane@example.com", time: "6 hours ago", status: "success" },
  { content: "System backup completed", time: "1 day ago", status: "success" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

export default function Dashboard() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-neutral-400 mt-1">Welcome back to your portfolio management system</p>
          </div>
          <Button type="primary" size="large">
            Create New
          </Button>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div variants={itemVariants}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card className="h-full hover:shadow-lg transition-shadow duration-300">
              <Statistic
                title="Total Users"
                value={1260}
                prefix={<UserOutlined />}
                suffix={<ArrowUpOutlined className="text-green-500 text-xs" />}
                valueStyle={{ color: "#7c3aed" }}
              />
              <div className="text-xs text-neutral-400 mt-3">+24 this month</div>
              <Progress percent={72} strokeColor="#7c3aed" className="mt-3" />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card className="h-full hover:shadow-lg transition-shadow duration-300">
              <Statistic
                title="Total Subscribers"
                value={890}
                prefix={<TeamOutlined />}
                suffix={<ArrowUpOutlined className="text-green-500 text-xs" />}
                valueStyle={{ color: "#7c3aed" }}
              />
              <div className="text-xs text-neutral-400 mt-3">+15 this week</div>
              <Progress percent={65} strokeColor="#7c3aed" className="mt-3" />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card className="h-full hover:shadow-lg transition-shadow duration-300">
              <Statistic
                title="Total Projects"
                value={24}
                prefix={<ProjectOutlined />}
                suffix={<ArrowUpOutlined className="text-green-500 text-xs" />}
                valueStyle={{ color: "#7c3aed" }}
              />
              <div className="text-xs text-neutral-400 mt-3">+3 in progress</div>
              <Progress percent={58} strokeColor="#7c3aed" className="mt-3" />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card className="h-full hover:shadow-lg transition-shadow duration-300">
              <Statistic
                title="Blog Views"
                value={12840}
                prefix={<FileTextOutlined />}
                suffix={<ArrowUpOutlined className="text-green-500 text-xs" />}
                valueStyle={{ color: "#7c3aed" }}
              />
              <div className="text-xs text-neutral-400 mt-3">+2300 this month</div>
              <Progress percent={85} strokeColor="#7c3aed" className="mt-3" />
            </Card>
          </Col>
        </Row>
      </motion.div>

      {/* Charts */}
      <motion.div variants={itemVariants}>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="Traffic Overview" className="hover:shadow-lg transition-shadow duration-300">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={trafficData}>
                  <defs>
                    <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="date" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155" }} />
                  <Area
                    type="monotone"
                    dataKey="visitors"
                    stroke="#7c3aed"
                    fillOpacity={1}
                    fill="url(#colorVisitors)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="Monthly Growth" className="hover:shadow-lg transition-shadow duration-300">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="month" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155" }} />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#7c3aed"
                    dot={{ fill: "#7c3aed", r: 4 }}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="subscribers"
                    stroke="#ec4899"
                    dot={{ fill: "#ec4899", r: 4 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>
      </motion.div>

      {/* Content Sections */}
      <motion.div variants={itemVariants}>
        <Row gutter={[16, 16]}>
          {/* Recent Activities */}
          <Col xs={24} lg={12}>
            <Card
              title="Recent Activities"
              className="hover:shadow-lg transition-shadow duration-300"
            >
              <Timeline
                items={activityTimeline.map((item) => ({
                  dot:
                    item.status === "success" ? (
                      <CheckCircleOutlined className="text-green-500 text-lg" />
                    ) : (
                      <ClockCircleOutlined className="text-blue-500 text-lg" />
                    ),
                  children: (
                    <div className="pb-4">
                      <p className="text-neutral-100 font-medium">{item.content}</p>
                      <span className="text-xs text-neutral-500">{item.time}</span>
                    </div>
                  ),
                }))}
              />
            </Card>
          </Col>

          {/* System Status */}
          <Col xs={24} lg={12}>
            <Card
              title="System Status"
              className="hover:shadow-lg transition-shadow duration-300"
            >
              <Space direction="vertical" style={{ width: "100%" }} size="large">
                <div className="flex items-center justify-between p-3 bg-neutral-800 rounded-lg">
                  <span className="text-neutral-300">API Server</span>
                  <Badge status="success" text="Operational" />
                </div>
                <div className="flex items-center justify-between p-3 bg-neutral-800 rounded-lg">
                  <span className="text-neutral-300">Database</span>
                  <Badge status="success" text="Operational" />
                </div>
                <div className="flex items-center justify-between p-3 bg-neutral-800 rounded-lg">
                  <span className="text-neutral-300">Storage</span>
                  <Badge status="success" text="Operational" />
                </div>
                <div className="flex items-center justify-between p-3 bg-neutral-800 rounded-lg">
                  <span className="text-neutral-300">Cache</span>
                  <Badge status="processing" text="Maintenance" />
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      </motion.div>

      {/* Recent Blogs and Subscribers */}
      <motion.div variants={itemVariants}>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card
              title="Latest Blog Posts"
              extra={<Button type="link" href="/dashboard/blogs">View All</Button>}
              className="hover:shadow-lg transition-shadow duration-300"
            >
              <Table
                dataSource={recentBlogs}
                columns={[
                  {
                    title: "Title",
                    dataIndex: "title",
                    key: "title",
                    render: (text) => <span className="text-neutral-100">{text}</span>,
                  },
                  {
                    title: "Views",
                    dataIndex: "views",
                    key: "views",
                    render: (views) => (
                      <span className="text-neutral-300 font-medium">{views}</span>
                    ),
                  },
                  {
                    title: "Date",
                    dataIndex: "date",
                    key: "date",
                    render: (date) => <span className="text-neutral-400 text-sm">{date}</span>,
                  },
                ]}
                pagination={false}
              />
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card
              title="Recent Subscribers"
              extra={<Button type="link" href="/dashboard/subscribers">View All</Button>}
              className="hover:shadow-lg transition-shadow duration-300"
            >
              <Space direction="vertical" style={{ width: "100%" }} size="middle">
                {recentSubscribers.map((sub) => (
                  <div key={sub.id} className="flex items-center justify-between p-3 bg-neutral-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar icon={<UserOutlined />} className="bg-violet-600" />
                      <div>
                        <p className="text-neutral-100 font-medium text-sm">{sub.email}</p>
                        <p className="text-xs text-neutral-500">{sub.date}</p>
                      </div>
                    </div>
                    <Tag color={sub.status === "verified" ? "green" : "orange"}>
                      {sub.status}
                    </Tag>
                  </div>
                ))}
              </Space>
            </Card>
          </Col>
        </Row>
      </motion.div>
    </motion.div>
  );
}
