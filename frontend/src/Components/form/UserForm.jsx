// Components/users/UserForm.jsx
import { Form, Input, Select, Button } from 'antd';

const divisions = ['Finance', 'HRD', 'Operasional', 'Marketing', 'IT', 'Procurement'];
const roles = ['Staff', 'Supervisor', 'Manager', 'Admin'];

export default function UserForm({ initialValues, onSubmit }) {
  const [form] = Form.useForm();

  return (
    <Form
      layout="vertical"
      form={form}
      initialValues={initialValues}
      onFinish={onSubmit}
    >
      <Form.Item
        name="name"
        label="Nama Lengkap"
        rules={[{ required: true, message: 'Nama wajib diisi' }]}
      >
        <Input placeholder="Masukkan nama lengkap" />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[{ required: true, message: 'Email wajib diisi' }]}
      >
        <Input placeholder="example@company.com" />
      </Form.Item>

      <Form.Item
        name="division"
        label="Divisi"
        rules={[{ required: true, message: 'Divisi wajib dipilih' }]}
      >
        <Select options={divisions.map((d) => ({ label: d, value: d }))} />
      </Form.Item>

      <Form.Item
        name="role"
        label="Role"
        rules={[{ required: true, message: 'Role wajib dipilih' }]}
      >
        <Select options={roles.map((r) => ({ label: r, value: r }))} />
      </Form.Item>

      <Button
        type="primary"
        htmlType="submit"
        className="w-full mt-2"
      >
        Save
      </Button>
    </Form>
  );
}
