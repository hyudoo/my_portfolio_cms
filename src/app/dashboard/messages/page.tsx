"use client";

import { Card, List, Button, Space, Input, Avatar, Badge, Modal, Form, Select, Row, Col, Drawer } from "antd";
import { SearchOutlined, MailOutlined, DeleteOutlined, ReplyOutlined, CheckOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useState } from "react";

interface Message {
  id: number;
  from: string;
  email: string;
  subject: string;
  content: string;
  date: string;
  read: boolean;
}

const mockMessages: Message[] = [
  {
    id: 1,
    from: "John Doe",
    email: "john@example.com",
    subject: "Interested in collaboration",
    content: "Hi, I saw your portfolio and would like to discuss a potential project...",
    date: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    from: "Jane Smith",
    email: "jane@example.com",
    subject: "Great work!",
    content: "Your recent blog post on React hooks was amazing. Thanks for sharing!",
    date: "5 hours ago",
    read: true,
  },
  {
    id: 3,
    from: "Bob Johnson",
    email: "bob@example.com",
    subject: "Project Inquiry",
    content: "We would like to hire you for our upcoming project...",
    date: "1 day ago",
    read: false,
  },
];

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyDrawerOpen, setReplyDrawerOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();

  const filteredMessages = messages.filter((msg) =>
    msg.from.toLowerCase().includes(searchText.toLowerCase()) ||
    msg.subject.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleReply = (message: Message) => {
    setSelectedMessage(message);
    setReplyDrawerOpen(true);
  };

  const handleMarkAsRead = (id: number) => {
    setMessages(messages.map((m) => (m.id === id ? { ...m, read: true } : m)));
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Delete Message",
      content: "Are you sure you want to delete this message?",
      okText: "Delete",
      cancelText: "Cancel",
      okButtonProps: { danger: true },
      onOk() {
        setMessages(messages.filter((m) => m.id !== id));
      },
    });
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Messages</h1>
          <p className="text-neutral-400 mt-1">Manage contact form submissions and inquiries</p>
        </div>
        <Badge count={unreadCount} style={{ backgroundColor: "#7c3aed" }}>
          <Button>Inbox</Button>
        </Badge>
      </div>

      <Card>
        <Input
          placeholder="Search messages..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="mb-4"
        />

        <List
          dataSource={filteredMessages}
          renderItem={(message) => (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              key={message.id}
              className="mb-3"
            >
              <Card
                className={`hover:shadow-lg transition-all cursor-pointer ${
                  !message.read ? "bg-neutral-800 border-violet-600/30" : ""
                }`}
                onClick={() => handleMarkAsRead(message.id)}
              >
                <Row gutter={16}>
                  <Col xs={2} sm={1}>
                    <Avatar size={40} className="bg-violet-600">{message.from[0]}</Avatar>
                  </Col>
                  <Col xs={22} sm={16}>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{message.from}</span>
                        {!message.read && <Badge color="#7c3aed" />}
                      </div>
                      <p className="text-xs text-neutral-500 mt-1">{message.email}</p>
                      <p className="text-neutral-100 font-medium mt-2">{message.subject}</p>
                      <p className="text-neutral-400 text-sm mt-1">{message.content.substring(0, 100)}...</p>
                    </div>
                  </Col>
                  <Col xs={24} sm={7} className="text-right">
                    <p className="text-xs text-neutral-500 mb-3">{message.date}</p>
                    <Space size="small">
                      <Button
                        type="text"
                        icon={<ReplyOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReply(message);
                        }}
                        className="text-blue-600 hover:text-blue-400"
                      />
                      <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(message.id);
                        }}
                        className="text-red-600 hover:text-red-400"
                        danger
                      />
                    </Space>
                  </Col>
                </Row>
              </Card>
            </motion.div>
          )}
        />
      </Card>

      {/* Reply Drawer */}
      <Drawer
        title={`Reply to ${selectedMessage?.from}`}
        placement="right"
        onClose={() => setReplyDrawerOpen(false)}
        open={replyDrawerOpen}
        width={500}
        className="md:w-1/2"
        footer={
          <Space className="w-full justify-end">
            <Button onClick={() => setReplyDrawerOpen(false)}>Cancel</Button>
            <Button type="primary">Send Reply</Button>
          </Space>
        }
      >
        {selectedMessage && (
          <div className="space-y-4">
            <Card>
              <p className="text-sm text-neutral-400">From: {selectedMessage.email}</p>
              <p className="text-sm font-medium text-white mt-2">Subject: {selectedMessage.subject}</p>
              <p className="text-neutral-300 mt-4">{selectedMessage.content}</p>
            </Card>

            <Form form={form} layout="vertical">
              <Form.Item label="Reply" name="reply" rules={[{ required: true }]}>
                <Input.TextArea placeholder="Type your reply..." rows={6} />
              </Form.Item>
            </Form>
          </div>
        )}
      </Drawer>
    </motion.div>
  );
}
