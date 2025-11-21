// Components/Karyawan/EditKaryawanForm.jsx
import { Form, Input, Button } from 'antd';
import { useEffect } from 'react';

export default function EditKaryawanForm({ setOpen, setData, data, selected }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (selected) {
      form.setFieldsValue({
        name: selected.name,
        email: selected.email,
        phone: selected.phone,
        address: selected.address,
        role: selected.role,
        division: selected.division,
      });
    }
  }, [selected, form]);

  const handleSubmit = (values) => {
    const updated = data.map((d) => (d.id === selected.id ? { ...d, ...values } : d));

    setData(updated);
    setOpen(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Edit Karyawan</h2>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        {/* Name */}
        <Form.Item
          label="Full Name"
          name="name"
          rules={[{ required: true, message: 'Name is required' }]}
        >
          <Input placeholder="Enter name" />
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
          <Input placeholder="Enter email" />
        </Form.Item>

        {/* Phone */}
        <Form.Item
          label="Phone Number"
          name="phone"
          rules={[{ required: true, message: 'Phone is required' }]}
        >
          <Input placeholder="Enter phone number" />
        </Form.Item>

        {/* Address */}
        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: 'Address is required' }]}
        >
          <Input.TextArea
            rows={3}
            placeholder="Enter address"
          />
        </Form.Item>

        {/* Role */}
        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true, message: 'Role is required' }]}
        >
          <Input placeholder="Enter role" />
        </Form.Item>

        {/* Division */}
        <Form.Item
          label="Division"
          name="division"
          rules={[{ required: true, message: 'Division is required' }]}
        >
          <Input placeholder="Enter division" />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            className="bg-blue-600 hover:bg-blue-700"
          >
            Update Karyawan
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
