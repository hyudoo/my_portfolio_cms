"use client";

import { useState } from "react";
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Select,
  Tag,
  Avatar,
  Drawer,
  Form,
  Upload,
  Modal,
  Badge,
  Row,
  Col,
  Tooltip,
} from "antd";
import {
  UserOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  joinDate: string;
  lastActive: string;
  avatar?: string;
}

const mockUsers: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "active",
    joinDate: "2024-01-15",
    lastActive: "Today",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Editor",
    status: "active",
    joinDate: "2024-02-20",
    lastActive: "Yesterday",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "Viewer",
    status: "inactive",
    joinDate: "2024-03-10",
    lastActive: "3 days ago",
  },
  {
    id: 4,
    name: "Alice Williams",
    email: "alice@example.com",
    role: "Editor",
    status: "active",
    joinDate: "2024-03-25",
    lastActive: "2 hours ago",
  },
  {
    id: 5,
    name: "Charlie Brown",
    email: "charlie@example.com",
    role: "Viewer",
    status: "active",
    joinDate: "2024-04-01",
    lastActive: "1 hour ago",
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchText, setSearchText] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [form] = Form.useForm();

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase());
    const matchesRole = !filterRole || user.role === filterRole;
    const matchesStatus = !filterStatus || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const openDrawer = (user?: User) => {
    if (user) {
      setSelectedUser(user);
      form.setFieldsValue(user);
    } else {
      setSelectedUser(null);
      form.resetFields();
    }
    setDrawerOpen(true);
  };

  const handleSave = () => {
    form.validateFields().then(() => {
      // Handle save logic
      setDrawerOpen(false);
    });
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Delete User",
      content: "Are you sure you want to delete this user?",
      okText: "Delete",
      cancelText: "Cancel",
      okButtonProps: { danger: true },
      onOk() {
        setUsers(users.filter((u) => u.id !== id));
      },
    });
  };

  const columns = [
    {
      title: "User",
      dataIndex: "name",
      key: "name",
      render: (_: string, record: User) => (
        <div className="flex items-center gap-3">
          <Avatar icon={<UserOutlined />} className="bg-violet-600" />
          <div>
            <p className="text-neutral-100 font-medium">{record.name}</p>
            <p className="text-xs text-neutral-500">{record.email}</p>
          </div>
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: string) => {
        const colors: Record<string, string> = {
          Admin: "volcano",
          Editor: "blue",
          Viewer: "cyan",
        };
        return <Tag color={colors[role] || "default"}>{role}</Tag>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Badge
          status={status === "active" ? "success" : "default"}
          text={status === "active" ? "Active" : "Inactive"}
        />
      ),
    },
    {
      title: "Last Active",
      dataIndex: "lastActive",
      key: "lastActive",
      render: (date: string) => <span className="text-neutral-400 text-sm">{date}</span>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: User) => (
        <Space size="small">
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => openDrawer(record)}
              className="text-violet-600 hover:text-violet-400"
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
              className="text-red-600 hover:text-red-400"
              danger
            />
          </Tooltip>
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Users Management</h1>
          <p className="text-neutral-400 mt-1">Manage and monitor user accounts</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => openDrawer()}
        >
          Add User
        </Button>
      </div>

      {/* Filters */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Search by name or email..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full"
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Filter by role"
              value={filterRole || undefined}
              onChange={setFilterRole}
              allowClear
              className="w-full"
              options={[
                { label: "Admin", value: "Admin" },
                { label: "Editor", value: "Editor" },
                { label: "Viewer", value: "Viewer" },
              ]}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Filter by status"
              value={filterStatus || undefined}
              onChange={setFilterStatus}
              allowClear
              className="w-full"
              options={[
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
              ]}
            />
          </Col>
        </Row>
      </Card>

      {/* Users Table */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <Table
          dataSource={filteredUsers}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 10,
            total: filteredUsers.length,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ["10", "20", "50"],
          }}
          className="overflow-x-auto"
        />
      </Card>

      {/* User Details Drawer */}
      <Drawer
        title={selectedUser ? "Edit User" : "Create New User"}
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={500}
        className="md:w-1/2"
        footer={
          <Space className="w-full justify-end">
            <Button onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={handleSave}>
              {selectedUser ? "Update" : "Create"}
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical" className="space-y-4">
          <Form.Item
            label="Full Name"
            name="name"
            rules={[{ required: true, message: "Please enter full name" }]}
          >
            <Input placeholder="John Doe" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Invalid email" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="john@example.com" />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please select role" }]}
          >
            <Select
              options={[
                { label: "Admin", value: "Admin" },
                { label: "Editor", value: "Editor" },
                { label: "Viewer", value: "Viewer" },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Select
              options={[
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
              ]}
            />
          </Form.Item>

          <Form.Item label="Avatar">
            <Upload
              maxCount={1}
              listType="picture-card"
              beforeUpload={() => false}
            >
              <div className="flex items-center justify-center h-20">
                <div className="text-center">
                  <UserOutlined className="text-2xl" />
                  <div className="text-xs mt-1">Upload Avatar</div>
                </div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </Drawer>
    </motion.div>
  );
}
