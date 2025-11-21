import React from 'react';
import { Form, Input, InputNumber, Button } from 'antd';

export default function FormAddStaff({ onSubmit }) {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    onSubmit(values);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
      >
        {/* Full Name */}
        <Form.Item
          label="Full Name"
          name="name"
          rules={[{ required: true, message: 'Name is required' }]}
        >
          <Input placeholder="Enter full name" />
        </Form.Item>

        {/* Email */}
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Email is required' },
            { type: 'email', message: 'Invalid email format' },
          ]}
        >
          <Input placeholder="Enter email address" />
        </Form.Item>

        {/* Phone Number */}
        <Form.Item
          label="Phone Number"
          name="phone"
          rules={[{ required: true, message: 'Phone is required' }]}
        >
          <Input placeholder="Enter phone number" />
        </Form.Item>

        {/* Salary */}
        <Form.Item
          label="Salary"
          name="salary"
          rules={[{ required: true, message: 'Salary is required' }]}
        >
          <InputNumber
            className="w-full"
            min={0}
            placeholder="Enter salary"
          />
        </Form.Item>

        {/* Role */}
        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true, message: 'Role is required' }]}
        >
          <Input placeholder="Enter staff role" />
        </Form.Item>

        {/* Division */}
        <Form.Item
          label="Division"
          name="division"
          rules={[{ required: true, message: 'Division is required' }]}
        >
          <Input placeholder="Enter staff division" />
        </Form.Item>

        {/* Address */}
        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: 'Address is required' }]}
        >
          <Input.TextArea
            rows={3}
            placeholder="Enter full address"
          />
        </Form.Item>

        {/* Submit */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            className="bg-teal-600 hover:bg-teal-700"
          >
            Save Staff
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
