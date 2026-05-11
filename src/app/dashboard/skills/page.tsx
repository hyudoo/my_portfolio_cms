"use client";

import { useState } from "react";
import {
  Card,
  Button,
  Space,
  Row,
  Col,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  Progress,
  Drawer,
  Empty,
  Tooltip,
  Segmented,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DragOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";

interface Skill {
  id: number;
  name: string;
  category: string;
  level: number;
  icon?: string;
}

const skillCategories = [
  "Backend",
  "Frontend",
  "Database",
  "DevOps",
  "Tools",
];

const mockSkills: Skill[] = [
  // Backend
  { id: 1, name: "Node.js", category: "Backend", level: 90, icon: "⚡" },
  { id: 2, name: "Python", category: "Backend", level: 85, icon: "🐍" },
  { id: 3, name: "Express.js", category: "Backend", level: 88, icon: "⚙️" },
  // Frontend
  { id: 4, name: "React", category: "Frontend", level: 95, icon: "⚛️" },
  { id: 5, name: "TypeScript", category: "Frontend", level: 92, icon: "📘" },
  { id: 6, name: "Tailwind CSS", category: "Frontend", level: 93, icon: "🎨" },
  // Database
  { id: 7, name: "PostgreSQL", category: "Database", level: 88, icon: "🗄️" },
  { id: 8, name: "MongoDB", category: "Database", level: 85, icon: "🍃" },
  // DevOps
  { id: 9, name: "Docker", category: "DevOps", level: 87, icon: "🐳" },
  { id: 10, name: "AWS", category: "DevOps", level: 82, icon: "☁️" },
  // Tools
  { id: 11, name: "Git", category: "Tools", level: 94, icon: "🔧" },
  { id: 12, name: "Figma", category: "Tools", level: 80, icon: "🎯" },
];

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>(mockSkills);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [form] = Form.useForm();

  const categories = skillCategories;
  const filteredSkills = selectedCategory
    ? skills.filter((s) => s.category === selectedCategory)
    : skills;

  const skillsByCategory = categories.map((cat) => ({
    category: cat,
    skills: skills.filter((s) => s.category === cat),
  }));

  const openDrawer = (skill?: Skill) => {
    if (skill) {
      setSelectedSkill(skill);
      form.setFieldsValue(skill);
    } else {
      setSelectedSkill(null);
      form.resetFields();
    }
    setDrawerOpen(true);
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      if (selectedSkill) {
        setSkills(
          skills.map((s) =>
            s.id === selectedSkill.id ? { ...selectedSkill, ...values } : s
          )
        );
      } else {
        const newSkill: Skill = {
          id: Math.max(...skills.map((s) => s.id), 0) + 1,
          ...values,
        };
        setSkills([...skills, newSkill]);
      }
      setDrawerOpen(false);
    });
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Delete Skill",
      content: "Are you sure you want to delete this skill?",
      okText: "Delete",
      cancelText: "Cancel",
      okButtonProps: { danger: true },
      onOk() {
        setSkills(skills.filter((s) => s.id !== id));
      },
    });
  };

  const levelColor = (level: number) => {
    if (level >= 90) return "#22c55e";
    if (level >= 80) return "#3b82f6";
    if (level >= 70) return "#f59e0b";
    return "#ef4444";
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
            <h1 className="text-3xl font-bold text-white">Skills</h1>
            <p className="text-neutral-400 mt-1">Manage your technical skills</p>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => openDrawer()}
          >
            Add Skill
          </Button>
        </div>
      </motion.div>

      {/* Category Filter */}
      <motion.div variants={itemVariants}>
        <Card>
          <Segmented
            value={selectedCategory}
            onChange={(value) => setSelectedCategory(value as string | null)}
            options={[
              { label: "All Skills", value: null },
              ...categories.map((cat) => ({ label: cat, value: cat })),
            ]}
            className="w-full"
          />
        </Card>
      </motion.div>

      {/* Skills Grid */}
      <motion.div variants={containerVariants}>
        {selectedCategory ? (
          // View by Category
          <Row gutter={[16, 16]}>
            {filteredSkills.length > 0 ? (
              filteredSkills.map((skill) => (
                <motion.div
                  key={skill.id}
                  variants={itemVariants}
                  className="w-full sm:w-1/2 lg:w-1/3"
                >
                  <Col span={24}>
                    <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="text-4xl">{skill.icon || "💻"}</div>
                          <Space size="small">
                            <Tooltip title="Edit">
                              <Button
                                type="text"
                                size="small"
                                icon={<EditOutlined />}
                                onClick={() => openDrawer(skill)}
                                className="text-blue-600 hover:text-blue-400"
                              />
                            </Tooltip>
                            <Tooltip title="Delete">
                              <Button
                                type="text"
                                size="small"
                                icon={<DeleteOutlined />}
                                onClick={() => handleDelete(skill.id)}
                                className="text-red-600 hover:text-red-400"
                                danger
                              />
                            </Tooltip>
                          </Space>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {skill.name}
                          </h3>
                          <Tag color="default" className="mt-2">
                            {skill.category}
                          </Tag>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-neutral-400">
                              Proficiency
                            </span>
                            <span className="text-sm font-semibold text-violet-600">
                              {skill.level}%
                            </span>
                          </div>
                          <Progress
                            percent={skill.level}
                            strokeColor={levelColor(skill.level)}
                            format={() => ""}
                          />
                        </div>
                      </div>
                    </Card>
                  </Col>
                </motion.div>
              ))
            ) : (
              <Col span={24}>
                <Card className="text-center py-20">
                  <Empty
                    description="No skills in this category"
                    style={{ color: "#cbd5e1" }}
                  />
                </Card>
              </Col>
            )}
          </Row>
        ) : (
          // View by Category Sections
          <div className="space-y-6">
            {skillsByCategory.map((item) => (
              <motion.div key={item.category} variants={itemVariants}>
                <Card
                  title={
                    <span className="text-lg font-semibold text-white">
                      {item.category}
                    </span>
                  }
                  className="hover:shadow-lg transition-shadow duration-300"
                >
                  <Row gutter={[16, 16]}>
                    {item.skills.map((skill) => (
                      <Col xs={24} sm={12} lg={8} key={skill.id}>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="p-4 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">
                                {skill.icon || "💻"}
                              </span>
                              <span className="text-neutral-400 cursor-move">
                                <DragOutlined />
                              </span>
                            </div>
                            <Space size="small">
                              <Tooltip title="Edit">
                                <Button
                                  type="text"
                                  size="small"
                                  icon={<EditOutlined />}
                                  onClick={() => openDrawer(skill)}
                                  className="text-blue-600 hover:text-blue-400"
                                />
                              </Tooltip>
                              <Tooltip title="Delete">
                                <Button
                                  type="text"
                                  size="small"
                                  icon={<DeleteOutlined />}
                                  onClick={() => handleDelete(skill.id)}
                                  className="text-red-600 hover:text-red-400"
                                  danger
                                />
                              </Tooltip>
                            </Space>
                          </div>

                          <h4 className="font-semibold text-white mb-2">
                            {skill.name}
                          </h4>

                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-neutral-400">
                              Proficiency
                            </span>
                            <span className="text-xs font-semibold text-violet-600">
                              {skill.level}%
                            </span>
                          </div>

                          <Progress
                            percent={skill.level}
                            strokeColor={levelColor(skill.level)}
                            format={() => ""}
                            size="small"
                          />
                        </motion.div>
                      </Col>
                    ))}
                  </Row>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Skill Drawer */}
      <Drawer
        title={selectedSkill ? "Edit Skill" : "Add New Skill"}
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={400}
        footer={
          <Space className="w-full justify-end">
            <Button onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={handleSave}>
              {selectedSkill ? "Update" : "Add"}
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical" className="space-y-4">
          <Form.Item
            label="Skill Name"
            name="name"
            rules={[{ required: true, message: "Please enter skill name" }]}
          >
            <Input placeholder="e.g., React" />
          </Form.Item>

          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: "Please select category" }]}
          >
            <Select
              options={skillCategories.map((cat) => ({
                label: cat,
                value: cat,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="Proficiency Level"
            name="level"
            rules={[{ required: true, message: "Please set proficiency level" }]}
          >
            <Select
              options={[
                { label: "Beginner (0-40%)", value: 30 },
                { label: "Intermediate (40-70%)", value: 55 },
                { label: "Advanced (70-90%)", value: 80 },
                { label: "Expert (90%+)", value: 95 },
              ]}
            />
          </Form.Item>

          <Form.Item label="Icon Emoji" name="icon">
            <Input placeholder="e.g., ⚛️" maxLength={5} />
          </Form.Item>
        </Form>
      </Drawer>
    </motion.div>
  );
}
