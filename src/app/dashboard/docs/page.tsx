"use client";

import { Card, Input, Button, Tree, Space, Modal, Form, Drawer, Row, Col, Empty } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, FileTextOutlined, FolderOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useState } from "react";

interface DocNode {
  title: string;
  key: string;
  icon?: React.ReactNode;
  children?: DocNode[];
  content?: string;
}

const docTree: DocNode[] = [
  {
    title: "Getting Started",
    key: "getting-started",
    icon: <FileTextOutlined />,
    content: "# Getting Started\n\nWelcome to the documentation...",
  },
  {
    title: "API Reference",
    key: "api",
    icon: <FolderOutlined />,
    children: [
      {
        title: "Authentication",
        key: "api-auth",
        icon: <FileTextOutlined />,
        content: "# Authentication\n\nLearn how to authenticate...",
      },
      {
        title: "Endpoints",
        key: "api-endpoints",
        icon: <FileTextOutlined />,
        content: "# API Endpoints\n\nAvailable endpoints...",
      },
    ],
  },
  {
    title: "Guides",
    key: "guides",
    icon: <FolderOutlined />,
    children: [
      {
        title: "Installation",
        key: "guide-install",
        icon: <FileTextOutlined />,
        content: "# Installation Guide\n\nStep by step...",
      },
      {
        title: "Configuration",
        key: "guide-config",
        icon: <FileTextOutlined />,
        content: "# Configuration\n\nHow to configure...",
      },
    ],
  },
];

export default function DocsPage() {
  const [selectedKey, setSelectedKey] = useState<string[]>(["getting-started"]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form] = Form.useForm();

  const findNodeByKey = (key: string, nodes: DocNode[]): DocNode | null => {
    for (const node of nodes) {
      if (node.key === key) return node;
      if (node.children) {
        const found = findNodeByKey(key, node.children);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedNode = selectedKey[0] ? findNodeByKey(selectedKey[0], docTree) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Technical Docs</h1>
          <p className="text-neutral-400 mt-1">Create and manage documentation</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setDrawerOpen(true)}>
          New Doc
        </Button>
      </div>

      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Card className="h-full">
            <Input
              placeholder="Search docs..."
              prefix={<SearchOutlined />}
              className="mb-4"
            />
            <Tree
              treeData={docTree}
              selectedKeys={selectedKey}
              onSelect={(keys) => setSelectedKey(keys as string[])}
            />
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <Card className="h-full">
            {selectedNode ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">{selectedNode.title}</h2>
                  <Space>
                    <Button type="text" icon={<EditOutlined />} className="text-blue-600" />
                    <Button type="text" icon={<DeleteOutlined />} className="text-red-600" danger />
                  </Space>
                </div>

                <Card className="bg-neutral-800 border-0">
                  <div className="text-neutral-300 whitespace-pre-wrap">
                    {selectedNode.content || "No content yet"}
                  </div>
                </Card>
              </div>
            ) : (
              <Empty description="Select a document to view" style={{ color: "#cbd5e1" }} />
            )}
          </Card>
        </Col>
      </Row>

      {/* Create/Edit Drawer */}
      <Drawer
        title="Create New Document"
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={500}
        footer={
          <Space className="w-full justify-end">
            <Button onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button type="primary">Create</Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical" className="space-y-4">
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please enter title" }]}
          >
            <Input placeholder="Document title..." />
          </Form.Item>

          <Form.Item label="Parent" name="parent">
            <select className="w-full bg-neutral-800 text-neutral-100 p-2 rounded border border-neutral-700">
              <option value="">Root</option>
              <option value="api">API Reference</option>
              <option value="guides">Guides</option>
            </select>
          </Form.Item>

          <Form.Item label="Content" name="content">
            <Input.TextArea placeholder="Write documentation in markdown..." rows={8} />
          </Form.Item>
        </Form>
      </Drawer>
    </motion.div>
  );
}
