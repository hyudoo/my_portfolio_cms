"use client";

import { useState } from "react";
import {
  Card,
  Button,
  Space,
  Input,
  Row,
  Col,
  Tag,
  Modal,
  Form,
  Select,
  Switch,
  Upload,
  Drawer,
  Tooltip,
  Empty,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  GitOutlined,
  ExternalLinkOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import Link from "next/link";

interface Project {
  id: number;
  title: string;
  description: string;
  tech: string[];
  featured: boolean;
  thumbnail?: string;
  github?: string;
  demo?: string;
  views: number;
  status: string;
}

const mockProjects: Project[] = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "Full-stack e-commerce solution with payment integration",
    tech: ["Next.js", "TypeScript", "Stripe", "PostgreSQL"],
    featured: true,
    views: 3240,
    status: "completed",
    github: "https://github.com",
    demo: "https://demo.com",
  },
  {
    id: 2,
    title: "AI Chat Application",
    description: "Real-time chat app with AI-powered responses",
    tech: ["React", "Node.js", "WebSocket", "OpenAI"],
    featured: true,
    views: 2150,
    status: "completed",
    github: "https://github.com",
    demo: "https://demo.com",
  },
  {
    id: 3,
    title: "Task Management System",
    description: "Collaborative task management with real-time updates",
    tech: ["Vue.js", "Firebase", "Tailwind"],
    featured: false,
    views: 1820,
    status: "completed",
    github: "https://github.com",
    demo: "https://demo.com",
  },
  {
    id: 4,
    title: "Data Analytics Dashboard",
    description: "Interactive analytics dashboard with data visualization",
    tech: ["React", "D3.js", "Python", "Django"],
    featured: false,
    views: 2540,
    status: "in-progress",
    github: "https://github.com",
  },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [searchText, setSearchText] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [form] = Form.useForm();

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const openDrawer = (project?: Project) => {
    if (project) {
      setSelectedProject(project);
      form.setFieldsValue(project);
    } else {
      setSelectedProject(null);
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
      title: "Delete Project",
      content: "Are you sure you want to delete this project?",
      okText: "Delete",
      cancelText: "Cancel",
      okButtonProps: { danger: true },
      onOk() {
        setProjects(projects.filter((p) => p.id !== id));
      },
    });
  };

  const toggleFeatured = (id: number) => {
    setProjects(
      projects.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p))
    );
  };

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
            <h1 className="text-3xl font-bold text-white">Projects</h1>
            <p className="text-neutral-400 mt-1">Manage your portfolio projects</p>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => openDrawer()}
          >
            New Project
          </Button>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div variants={itemVariants}>
        <Input
          placeholder="Search projects..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full md:w-80"
        />
      </motion.div>

      {/* Projects Grid */}
      <motion.div variants={containerVariants}>
        {filteredProjects.length > 0 ? (
          <Row gutter={[16, 16]}>
            {filteredProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                className="w-full"
              >
                <Col span={24}>
                  <Card
                    className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full"
                    hoverable
                  >
                    <Row gutter={16}>
                      <Col xs={24} md={6}>
                        <div className="w-full h-48 md:h-full bg-gradient-to-br from-violet-600/20 to-purple-600/20 rounded-lg border border-violet-500/20 flex items-center justify-center">
                          {project.thumbnail ? (
                            <img
                              src={project.thumbnail}
                              alt={project.title}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="text-center text-violet-400">
                              <div className="text-4xl mb-2">📦</div>
                              <span className="text-sm">No thumbnail</span>
                            </div>
                          )}
                        </div>
                      </Col>

                      <Col xs={24} md={18}>
                        <div className="space-y-4">
                          {/* Header */}
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-xl font-bold text-white">
                                  {project.title}
                                </h3>
                                {project.featured && (
                                  <Tag color="gold">Featured</Tag>
                                )}
                              </div>
                              <p className="text-neutral-400 text-sm mt-1">
                                {project.description}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-violet-600">
                                {project.views}
                              </div>
                              <div className="text-xs text-neutral-500">Views</div>
                            </div>
                          </div>

                          {/* Tech Stack */}
                          <div className="flex flex-wrap gap-2">
                            {project.tech.map((tech, idx) => (
                              <Tag key={idx} color="blue" className="text-xs">
                                {tech}
                              </Tag>
                            ))}
                          </div>

                          {/* Status & Links */}
                          <div className="flex items-center justify-between">
                            <Tag
                              color={
                                project.status === "completed"
                                  ? "green"
                                  : "processing"
                              }
                            >
                              {project.status === "completed"
                                ? "Completed"
                                : "In Progress"}
                            </Tag>

                            <Space size="small">
                              {project.demo && (
                                <Tooltip title="View Demo">
                                  <Button
                                    type="text"
                                    icon={<EyeOutlined />}
                                    href={project.demo}
                                    target="_blank"
                                    className="text-violet-600 hover:text-violet-400"
                                  />
                                </Tooltip>
                              )}
                              {project.github && (
                                <Tooltip title="View on GitHub">
                                  <Button
                                    type="text"
                                    icon={<GitOutlined />}
                                    href={project.github}
                                    target="_blank"
                                    className="text-neutral-400 hover:text-neutral-100"
                                  />
                                </Tooltip>
                              )}
                              <Tooltip title="Edit">
                                <Button
                                  type="text"
                                  icon={<EditOutlined />}
                                  onClick={() => openDrawer(project)}
                                  className="text-blue-600 hover:text-blue-400"
                                />
                              </Tooltip>
                              <Tooltip title="Delete">
                                <Button
                                  type="text"
                                  icon={<DeleteOutlined />}
                                  onClick={() => handleDelete(project.id)}
                                  className="text-red-600 hover:text-red-400"
                                  danger
                                />
                              </Tooltip>
                            </Space>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </motion.div>
            ))}
          </Row>
        ) : (
          <Card className="text-center py-20">
            <Empty
              description="No projects found"
              style={{ color: "#cbd5e1" }}
            />
          </Card>
        )}
      </motion.div>

      {/* Project Details Drawer */}
      <Drawer
        title={selectedProject ? "Edit Project" : "Create New Project"}
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={500}
        className="md:w-1/2"
        footer={
          <Space className="w-full justify-end">
            <Button onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={handleSave}>
              {selectedProject ? "Update" : "Create"}
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical" className="space-y-4">
          <Form.Item
            label="Project Title"
            name="title"
            rules={[{ required: true, message: "Please enter project title" }]}
          >
            <Input placeholder="My Awesome Project" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input.TextArea
              placeholder="Project description..."
              rows={4}
            />
          </Form.Item>

          <Form.Item label="Thumbnail">
            <Upload
              maxCount={1}
              listType="picture-card"
              beforeUpload={() => false}
            >
              <div className="flex items-center justify-center h-20">
                <div className="text-center">
                  <div className="text-2xl">📷</div>
                  <div className="text-xs mt-1">Upload Thumbnail</div>
                </div>
              </div>
            </Upload>
          </Form.Item>

          <Form.Item
            label="Tech Stack"
            name="tech"
            rules={[{ required: true, message: "Please enter tech stack" }]}
          >
            <Select
              mode="tags"
              placeholder="Add technologies..."
            />
          </Form.Item>

          <Form.Item label="GitHub URL" name="github">
            <Input placeholder="https://github.com/..." />
          </Form.Item>

          <Form.Item label="Demo URL" name="demo">
            <Input placeholder="https://demo.com" />
          </Form.Item>

          <Form.Item label="Status" name="status" initialValue="completed">
            <Select
              options={[
                { label: "Completed", value: "completed" },
                { label: "In Progress", value: "in-progress" },
              ]}
            />
          </Form.Item>

          <Form.Item label="Featured Project" name="featured" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Drawer>
    </motion.div>
  );
}
