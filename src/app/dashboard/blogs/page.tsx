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
  Modal,
  Form,
  Upload,
  Drawer,
  Row,
  Col,
  Badge,
  Tooltip,
  Tabs,
  Segmented,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";

interface Blog {
  id: number;
  title: string;
  excerpt: string;
  content?: string;
  status: "draft" | "published";
  views: number;
  readTime: number;
  tags: string[];
  category: string;
  publishDate?: string;
  author: string;
  thumbnail?: string;
}

const mockBlogs: Blog[] = [
  {
    id: 1,
    title: "Building Modern Dashboards with Ant Design",
    excerpt: "Learn how to create beautiful dashboards using Ant Design v5...",
    status: "published",
    views: 1240,
    readTime: 8,
    tags: ["antd", "dashboard", "react"],
    category: "Frontend",
    publishDate: "2024-04-15",
    author: "John Doe",
  },
  {
    id: 2,
    title: "Next.js 14 Performance Tips",
    excerpt: "Optimize your Next.js applications with these proven techniques...",
    status: "published",
    views: 980,
    readTime: 6,
    tags: ["nextjs", "performance", "optimization"],
    category: "Backend",
    publishDate: "2024-04-10",
    author: "John Doe",
  },
  {
    id: 3,
    title: "React Hooks Deep Dive",
    excerpt: "Master React hooks and improve your component architecture...",
    status: "draft",
    views: 0,
    readTime: 12,
    tags: ["react", "hooks", "advanced"],
    category: "Frontend",
    author: "John Doe",
  },
  {
    id: 4,
    title: "TypeScript Best Practices",
    excerpt: "Write type-safe code with these TypeScript best practices...",
    status: "published",
    views: 2100,
    readTime: 10,
    tags: ["typescript", "best-practices"],
    category: "Frontend",
    publishDate: "2024-03-20",
    author: "John Doe",
  },
];

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>(mockBlogs);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [form] = Form.useForm();

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch = blog.title
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesStatus = !filterStatus || blog.status === filterStatus;
    const matchesCategory =
      !filterCategory || blog.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const openDrawer = (blog?: Blog) => {
    if (blog) {
      setSelectedBlog(blog);
      form.setFieldsValue(blog);
    } else {
      setSelectedBlog(null);
      form.resetFields();
    }
    setDrawerOpen(true);
  };

  const handleSave = () => {
    form.validateFields().then(() => {
      setDrawerOpen(false);
    });
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Delete Blog Post",
      content: "Are you sure you want to delete this blog post?",
      okText: "Delete",
      cancelText: "Cancel",
      okButtonProps: { danger: true },
      onOk() {
        setBlogs(blogs.filter((b) => b.id !== id));
      },
    });
  };

  const togglePublish = (id: number) => {
    setBlogs(
      blogs.map((b) =>
        b.id === id
          ? {
              ...b,
              status: b.status === "published" ? "draft" : "published",
              publishDate:
                b.status === "draft" ? new Date().toISOString().split("T")[0] : b.publishDate,
            }
          : b
      )
    );
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: 250,
      render: (_: string, record: Blog) => (
        <div>
          <p className="text-neutral-100 font-medium">{record.title}</p>
          <p className="text-xs text-neutral-500 mt-1">{record.excerpt}</p>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category: string) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Badge
          status={status === "published" ? "success" : "default"}
          text={status === "published" ? "Published" : "Draft"}
        />
      ),
    },
    {
      title: "Views",
      dataIndex: "views",
      key: "views",
      render: (views: number) => (
        <span className="text-neutral-300 font-medium">{views}</span>
      ),
    },
    {
      title: "Read Time",
      dataIndex: "readTime",
      key: "readTime",
      render: (time: number) => (
        <span className="text-neutral-400 text-sm">{time} min</span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: Blog) => (
        <Space size="small">
          {record.status === "published" && (
            <Tooltip title="View">
              <Button
                type="text"
                icon={<EyeOutlined />}
                className="text-green-600 hover:text-green-400"
              />
            </Tooltip>
          )}
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => openDrawer(record)}
              className="text-blue-600 hover:text-blue-400"
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

  const statsCards = [
    {
      label: "Total Posts",
      value: blogs.length,
      color: "#7c3aed",
    },
    {
      label: "Published",
      value: blogs.filter((b) => b.status === "published").length,
      color: "#22c55e",
    },
    {
      label: "Drafts",
      value: blogs.filter((b) => b.status === "draft").length,
      color: "#f59e0b",
    },
    {
      label: "Total Views",
      value: blogs.reduce((sum, b) => sum + b.views, 0),
      color: "#3b82f6",
    },
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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Blog Management</h1>
            <p className="text-neutral-400 mt-1">Create and manage blog posts</p>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => openDrawer()}
          >
            New Blog Post
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants}>
        <Row gutter={[16, 16]}>
          {statsCards.map((stat) => (
            <Col xs={12} sm={6} key={stat.label}>
              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <div className="text-2xl font-bold" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-xs text-neutral-500 mt-1">{stat.label}</div>
              </Card>
            </Col>
          ))}
        </Row>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants}>
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8}>
              <Input
                placeholder="Search blogs..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full"
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
                  { label: "Published", value: "published" },
                  { label: "Draft", value: "draft" },
                ]}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Select
                placeholder="Filter by category"
                value={filterCategory || undefined}
                onChange={setFilterCategory}
                allowClear
                className="w-full"
                options={[
                  { label: "Frontend", value: "Frontend" },
                  { label: "Backend", value: "Backend" },
                  { label: "DevOps", value: "DevOps" },
                ]}
              />
            </Col>
          </Row>
        </Card>
      </motion.div>

      {/* Blogs Table */}
      <motion.div variants={itemVariants}>
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <Table
            dataSource={filteredBlogs}
            columns={columns}
            rowKey="id"
            pagination={{
              pageSize: 10,
              total: filteredBlogs.length,
              showSizeChanger: true,
              showQuickJumper: true,
            }}
          />
        </Card>
      </motion.div>

      {/* Blog Editor Drawer */}
      <Drawer
        title={selectedBlog ? "Edit Blog Post" : "Create New Blog Post"}
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={600}
        className="md:w-2/3"
        footer={
          <Space className="w-full justify-end">
            <Button onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={handleSave}>
              {selectedBlog ? "Update" : "Create"}
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical" className="space-y-4">
          <Form.Item
            label="Blog Title"
            name="title"
            rules={[{ required: true, message: "Please enter blog title" }]}
          >
            <Input placeholder="Amazing blog post title..." />
          </Form.Item>

          <Form.Item
            label="Excerpt"
            name="excerpt"
            rules={[{ required: true, message: "Please enter excerpt" }]}
          >
            <Input.TextArea
              placeholder="Brief description..."
              rows={2}
            />
          </Form.Item>

          <Form.Item label="Thumbnail">
            <Upload
              maxCount={1}
              listType="picture-card"
              beforeUpload={() => false}
            >
              <div className="flex items-center justify-center h-24">
                <div className="text-center">
                  <FileTextOutlined className="text-3xl" />
                  <div className="text-xs mt-2">Upload Thumbnail</div>
                </div>
              </div>
            </Upload>
          </Form.Item>

          <Form.Item
            label="Content"
            name="content"
            rules={[{ required: true, message: "Please enter content" }]}
          >
            <Input.TextArea
              placeholder="Write your blog content here... (supports markdown)"
              rows={8}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Category"
                name="category"
                rules={[{ required: true }]}
              >
                <Select
                  options={[
                    { label: "Frontend", value: "Frontend" },
                    { label: "Backend", value: "Backend" },
                    { label: "DevOps", value: "DevOps" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Status"
                name="status"
                initialValue="draft"
              >
                <Select
                  options={[
                    { label: "Draft", value: "draft" },
                    { label: "Published", value: "published" },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Tags" name="tags">
            <Select
              mode="tags"
              placeholder="Add tags..."
            />
          </Form.Item>
        </Form>
      </Drawer>
    </motion.div>
  );
}
