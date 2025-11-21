// Components/staff/FormAddStaff.jsx
import { useEffect } from 'react';
import { Form, Input, Select, Button } from 'antd';

export default function FormAddStaff({ initialValues, onSubmit }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues]);

  const handleFinish = (values) => {
    onSubmit(values);
  };

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={handleFinish}
    >
      {/* Full Name */}
      <Form.Item
        label="Nama Lengkap"
        name="name"
        rules={[{ required: true, message: 'Nama wajib diisi' }]}
      >
        <Input placeholder="Masukkan nama lengkap" />
      </Form.Item>

      {/* Email */}
      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: 'Email wajib diisi' },
          { type: 'email', message: 'Format email tidak valid' },
        ]}
      >
        <Input placeholder="contoh@mail.com" />
      </Form.Item>

      {/* Username */}
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Username wajib diisi' }]}
      >
        <Input placeholder="Masukkan username" />
      </Form.Item>

      {/* Password */}
      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Password wajib diisi' }]}
      >
        <Input.Password placeholder="••••••••" />
      </Form.Item>

      {/* Role */}
      <Form.Item
        label="Role Staff"
        name="role"
        rules={[{ required: true, message: 'Role wajib dipilih' }]}
      >
        <Select placeholder="Pilih role">
          <Select.Option value="Super Admin">Super Admin</Select.Option>
          <Select.Option value="Admin">Admin</Select.Option>
          <Select.Option value="Operator">Operator</Select.Option>
        </Select>
      </Form.Item>

      {/* Division */}
      <Form.Item
        label="Divisi"
        name="division"
        rules={[{ required: true, message: 'Divisi wajib dipilih' }]}
      >
        <Select placeholder="Pilih divisi">
          <Select.Option value="Finance">Finance</Select.Option>
          <Select.Option value="HRD">HRD</Select.Option>
          <Select.Option value="Operasional">Operasional</Select.Option>
          <Select.Option value="IT Support">IT Support</Select.Option>
          <Select.Option value="Marketing">Marketing</Select.Option>
        </Select>
      </Form.Item>

      {/* Submit */}
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          block
        >
          {initialValues ? 'Update Staff' : 'Tambah Staff'}
        </Button>
      </Form.Item>
    </Form>
  );
}
