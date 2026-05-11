"use client";

import {
  Card,
  Row,
  Col,
  Statistic,
  Select,
  Table,
  Tag,
} from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const trafficData = [
  { date: "Jan 1", visits: 2400, users: 2210, pageViews: 9800 },
  { date: "Jan 5", visits: 3210, users: 2290, pageViews: 7800 },
  { date: "Jan 10", visits: 2000, users: 9800, pageViews: 9800 },
  { date: "Jan 15", visits: 2780, users: 3908, pageViews: 3800 },
  { date: "Jan 20", visits: 1890, users: 4800, pageViews: 4800 },
  { date: "Jan 25", visits: 2390, users: 3800, pageViews: 3800 },
  { date: "Jan 30", visits: 3490, users: 4300, pageViews: 4800 },
];

const deviceData = [
  { name: "Desktop", value: 65, fill: "#7c3aed" },
  { name: "Mobile", value: 28, fill: "#ec4899" },
  { name: "Tablet", value: 7, fill: "#3b82f6" },
];

const topPages = [
  { page: "/", views: 12450, uniqueUsers: 8934, bounceRate: "32%" },
  { page: "/about", views: 8934, uniqueUsers: 6234, bounceRate: "28%" },
  { page: "/blog", views: 7234, uniqueUsers: 5123, bounceRate: "45%" },
  { page: "/projects", views: 6123, uniqueUsers: 4234, bounceRate: "38%" },
];

export default function AnalyticsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="text-neutral-400 mt-1">Website traffic and user engagement</p>
        </div>
        <Select
          defaultValue="30days"
          style={{ width: 150 }}
          options={[
            { label: "Last 7 Days", value: "7days" },
            { label: "Last 30 Days", value: "30days" },
            { label: "Last 90 Days", value: "90days" },
            { label: "Last Year", value: "1year" },
          ]}
        />
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-lg transition-shadow">
            <Statistic
              title="Total Visits"
              value={38203}
              prefix={<ArrowUpOutlined className="text-green-500 text-xs" />}
              valueStyle={{ color: "#7c3aed" }}
            />
            <p className="text-xs text-green-500 mt-2">+23% from last period</p>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-lg transition-shadow">
            <Statistic
              title="Unique Users"
              value={18934}
              suffix={<ArrowUpOutlined className="text-green-500 text-xs" />}
              valueStyle={{ color: "#7c3aed" }}
            />
            <p className="text-xs text-green-500 mt-2">+12% from last period</p>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-lg transition-shadow">
            <Statistic
              title="Bounce Rate"
              value={32.5}
              suffix="%"
              valueStyle={{ color: "#7c3aed" }}
            />
            <p className="text-xs text-red-500 mt-2">+2% from last period</p>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-lg transition-shadow">
            <Statistic
              title="Avg Session"
              value={4.32}
              suffix="min"
              valueStyle={{ color: "#7c3aed" }}
            />
            <p className="text-xs text-green-500 mt-2">+8% from last period</p>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Traffic Trend" className="hover:shadow-lg transition-shadow">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155" }} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="visits"
                  stroke="#7c3aed"
                  dot={{ fill: "#7c3aed", r: 4 }}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#ec4899"
                  dot={{ fill: "#ec4899", r: 4 }}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Device Distribution" className="hover:shadow-lg transition-shadow">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Card title="Top Pages" className="hover:shadow-lg transition-shadow">
        <Table
          dataSource={topPages}
          columns={[
            {
              title: "Page",
              dataIndex: "page",
              key: "page",
              render: (page: string) => <span className="text-neutral-100 font-medium">{page}</span>,
            },
            {
              title: "Views",
              dataIndex: "views",
              key: "views",
              render: (views: number) => <span className="text-neutral-300">{views.toLocaleString()}</span>,
            },
            {
              title: "Unique Users",
              dataIndex: "uniqueUsers",
              key: "uniqueUsers",
              render: (users: number) => <span className="text-neutral-300">{users.toLocaleString()}</span>,
            },
            {
              title: "Bounce Rate",
              dataIndex: "bounceRate",
              key: "bounceRate",
              render: (rate: string) => <Tag color="orange">{rate}</Tag>,
            },
          ]}
          pagination={false}
        />
      </Card>
    </motion.div>
  );
}
