"use client";

import { Card, Table, Button, Space, Input, Tag, Row, Col, Modal, Form, Select, Statistic } from "antd";
import { SearchOutlined, PlusOutlined, MailOutlined, DeleteOutlined, ExportOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

interface Subscriber {
  id: number;
  email: string;
  status: string;
  subscribeDate: string;
  lastEmailSent?: string;
}

const mockSubscribers: Subscriber[] = [
  { id: 1, email: "john@example.com", status: "active", subscribeDate: "2024-01-15", lastEmailSent: "2 days ago" },
  { id: 2, email: "jane@example.com", status: "active", subscribeDate: "2024-02-20", lastEmailSent: "Today" },
  { id: 3, email: "bob@example.com", status: "inactive", subscribeDate: "2024-01-10", lastEmailSent: "1 month ago" },
  { id: 4, email: "alice@example.com", status: "active", subscribeDate: "2024-03-25", lastEmailSent: "Today" },
];

export default function SubscribersPage() {
  const [subscribers] = React.useState<Subscriber[]>(mockSubscribers);
  const [searchText, setSearchText] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState("");
  const [form] = Form.useForm();

  const filteredSubscribers = subscribers.filter((sub) => {
    const matchesSearch = sub.email.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = !filterStatus || sub.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSendNewsletter = () => {
    Modal.confirm({
      title: "Send Newsletter",
      content: "Send newsletter to all active subscribers?",
      okText: "Send",
      cancelText: "Cancel",
      onOk() {
        // Handle send newsletter
      },
    });
  };

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email: string) => <span className="text-neutral-100">{email}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => <Tag color={status === "active" ? "green" : "red"}>{status}</Tag>,
    },
    {
      title: "Subscribed",
      dataIndex: "subscribeDate",
      key: "subscribeDate",
      render: (date: string) => <span className="text-neutral-400 text-sm">{date}</span>,
    },
    {
      title: "Actions",
      key: "actions",
      render: () => (
        <Space size="small">
          <Button type="text" icon={<MailOutlined />} className="text-violet-600 hover:text-violet-400" />
          <Button type="text" icon={<DeleteOutlined />} className="text-red-600 hover:text-red-400" danger />
        </Space>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Subscribers</h1>
          <p className="text-neutral-400 mt-1">Newsletter subscriber management</p>
        </div>
        <Space>
          <Button icon={<ExportOutlined />}>Export CSV</Button>
          <Button type="primary" icon={<MailOutlined />} onClick={handleSendNewsletter}>
            Send Newsletter
          </Button>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}><Card><Statistic title="Total Subscribers" value={subscribers.length} valueStyle={{ color: "#7c3aed" }} /></Card></Col>
        <Col xs={24} sm={8}><Card><Statistic title="Active" value={subscribers.filter(s => s.status === "active").length} valueStyle={{ color: "#22c55e" }} /></Card></Col>
        <Col xs={24} sm={8}><Card><Statistic title="Inactive" value={subscribers.filter(s => s.status === "inactive").length} valueStyle={{ color: "#ef4444" }} /></Card></Col>
      </Row>

      <Card>
        <Input
          placeholder="Search by email..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="mb-4"
        />
        <Table dataSource={filteredSubscribers} columns={columns} rowKey="id" pagination={false} />
      </Card>
    </motion.div>
  );
}

import React from "react";
