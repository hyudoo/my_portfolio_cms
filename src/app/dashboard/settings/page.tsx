"use client";

import { Card, Form, Input, Button, Space, Switch, Select, Divider, Upload, Row, Col, Message, Tabs } from "antd";
import { SaveOutlined, UploadOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useState } from "react";

export default function SettingsPage() {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState("general");

  const handleSave = () => {
    form.validateFields().then(() => {
      // Handle save
    });
  };

  const tabs = [
    {
      label: "General",
      key: "general",
      children: (
        <Card className="hover:shadow-lg transition-shadow">
          <Form form={form} layout="vertical" className="space-y-4">
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="First Name"
                  name="firstName"
                  initialValue="John"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Last Name"
                  name="lastName"
                  initialValue="Doe"
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Email Address"
              name="email"
              initialValue="john@example.com"
            >
              <Input type="email" />
            </Form.Item>

            <Form.Item
              label="Bio"
              name="bio"
              initialValue="Full-stack developer and portfolio creator"
            >
              <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item label="Profile Picture">
              <Upload maxCount={1} listType="picture-card">
                <div className="flex items-center justify-center h-20">
                  <div className="text-center">
                    <UploadOutlined className="text-2xl" />
                    <div className="text-xs mt-1">Upload Photo</div>
                  </div>
                </div>
              </Upload>
            </Form.Item>
          </Form>
        </Card>
      ),
    },
    {
      label: "Notifications",
      key: "notifications",
      children: (
        <Card className="hover:shadow-lg transition-shadow">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-neutral-800 rounded-lg">
              <span className="text-neutral-100">Email Notifications</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 bg-neutral-800 rounded-lg">
              <span className="text-neutral-100">New Subscribers</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 bg-neutral-800 rounded-lg">
              <span className="text-neutral-100">New Messages</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 bg-neutral-800 rounded-lg">
              <span className="text-neutral-100">Weekly Digest</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 bg-neutral-800 rounded-lg">
              <span className="text-neutral-100">Newsletter</span>
              <Switch />
            </div>
          </div>
        </Card>
      ),
    },
    {
      label: "Preferences",
      key: "preferences",
      children: (
        <Card className="hover:shadow-lg transition-shadow">
          <Form form={form} layout="vertical" className="space-y-4">
            <Form.Item label="Timezone">
              <Select
                defaultValue="utc"
                options={[
                  { label: "UTC", value: "utc" },
                  { label: "EST", value: "est" },
                  { label: "CST", value: "cst" },
                  { label: "PST", value: "pst" },
                ]}
              />
            </Form.Item>

            <Form.Item label="Language">
              <Select
                defaultValue="en"
                options={[
                  { label: "English", value: "en" },
                  { label: "Vietnamese", value: "vi" },
                  { label: "Spanish", value: "es" },
                  { label: "French", value: "fr" },
                ]}
              />
            </Form.Item>

            <Form.Item label="Theme">
              <Select
                defaultValue="dark"
                options={[
                  { label: "Dark Mode", value: "dark" },
                  { label: "Light Mode", value: "light" },
                  { label: "Auto", value: "auto" },
                ]}
              />
            </Form.Item>

            <Divider />

            <div>
              <h3 className="text-white font-semibold mb-3">Privacy</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-neutral-800 rounded-lg">
                  <span className="text-neutral-100">Public Profile</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 bg-neutral-800 rounded-lg">
                  <span className="text-neutral-100">Show Email</span>
                  <Switch />
                </div>
              </div>
            </div>
          </Form>
        </Card>
      ),
    },
    {
      label: "Security",
      key: "security",
      children: (
        <Card className="hover:shadow-lg transition-shadow">
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-semibold mb-3">Password</h3>
              <Button danger block>
                Change Password
              </Button>
            </div>

            <Divider />

            <div>
              <h3 className="text-white font-semibold mb-3">Two-Factor Authentication</h3>
              <p className="text-neutral-400 text-sm mb-3">Add an extra layer of security to your account</p>
              <Button>Enable 2FA</Button>
            </div>

            <Divider />

            <div>
              <h3 className="text-white font-semibold mb-3">Active Sessions</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-neutral-800 rounded-lg">
                  <div>
                    <p className="text-neutral-100 text-sm">Chrome on macOS</p>
                    <p className="text-neutral-500 text-xs">Last active: Today</p>
                  </div>
                  <Button type="text" danger size="small">Logout</Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
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
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-neutral-400 mt-1">Manage your account and preferences</p>
        </div>
        <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
          Save Changes
        </Button>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabs}
      />
    </motion.div>
  );
}
