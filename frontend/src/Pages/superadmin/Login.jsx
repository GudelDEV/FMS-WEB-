import React, { useState } from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

export default function Login({ onLogin }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);

    // Simulasi API
    setTimeout(() => {
      if (values.username === 'admin' && values.password === 'admin123') {
        message.success('Login berhasil!');
        onLogin &&
          onLogin({
            username: 'admin',
            role: 'admin',
          });
      } else {
        message.error('Username atau password salah');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

        <Form
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Username wajib diisi' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Masukkan username"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Password wajib diisi' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Masukkan password"
              size="large"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={loading}
            className="w-full mt-2"
          >
            Login
          </Button>
        </Form>
      </Card>
    </div>
  );
}
