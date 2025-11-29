// Components/staff/FormAddStaff.jsx
import { useEffect } from "react";
import { Form, Input, Select, Button } from "antd";

export default function FormAddStaff({ initialValues, onSubmit, divisions }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        division: initialValues.divisiId || null, // set divisiId sebagai value
      });
    } else {
      form.resetFields();
    }
  }, [initialValues]);

  const handleFinish = (values) => {
    // Ambil divisiId dari select, dan optional nama divisi jika perlu
    const selectedDivision = divisions.find((d) => d.id === values.division);
    const dataToSubmit = {
      ...values,
      divisiId: values.division, // kirim id divisi ke backend
      divisionName: selectedDivision?.name || null, // optional: nama divisi
    };
    delete dataToSubmit.division; // hapus field sementara untuk Select
    onSubmit(dataToSubmit);
  };

  return (
    <Form layout="vertical" form={form} onFinish={handleFinish}>
      {/* Full Name */}
      <Form.Item
        label="Nama Lengkap"
        name="name"
        rules={[{ required: true, message: "Nama wajib diisi" }]}
      >
        <Input placeholder="Masukkan nama lengkap" />
      </Form.Item>

      {/* Email */}
      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: "Email wajib diisi" },
          { type: "email", message: "Format email tidak valid" },
        ]}
      >
        <Input placeholder="contoh@mail.com" />
      </Form.Item>

      {/* Username */}
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: "Username wajib diisi" }]}
      >
        <Input placeholder="Masukkan username" />
      </Form.Item>

      {/* Password */}
      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: !initialValues, message: "Password wajib diisi" }]}
      >
        <Input.Password placeholder="••••••••" />
      </Form.Item>

      {/* Role */}
      <Form.Item
        label="Role Staff"
        name="role"
        rules={[{ required: true, message: "Role wajib dipilih" }]}
      >
        <Select placeholder="Pilih role">
          <Select.Option value="superadmin">Super Admin</Select.Option>
          <Select.Option value="staff">Staff</Select.Option>
        </Select>
      </Form.Item>

      {/* Division */}
      <Form.Item
        label="Divisi"
        name="division"
        rules={[{ required: true, message: "Divisi wajib dipilih" }]}
      >
        <Select placeholder="Pilih divisi">
          {divisions.map((d) => (
            <Select.Option key={d.id} value={d.id}>
              {d.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {/* Submit */}
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          {initialValues ? "Update Staff" : "Tambah Staff"}
        </Button>
      </Form.Item>
    </Form>
  );
}
