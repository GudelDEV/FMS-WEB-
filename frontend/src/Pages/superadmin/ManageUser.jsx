// pages/ManageUsers.jsx
import { useState } from 'react';
import { Button, Table, Tag, Modal, message, Input } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  TeamOutlined,
  ApartmentOutlined,
  CrownOutlined,
} from '@ant-design/icons';
import FormAddStaff from '../../Components/form/FormAddStaff';

export default function ManageUsers() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [searchText, setSearchText] = useState('');

  // Dummy data untuk sementara
  const [users, setUsers] = useState([
    { id: 1, name: 'Budi Santoso', email: 'budi@company.com', division: 'Finance', role: 'Staff' },
    { id: 2, name: 'Ani Wijaya', email: 'ani@company.com', division: 'HRD', role: 'Manager' },
    { id: 3, name: 'Dedi Pratama', email: 'dedi@company.com', division: 'Operasional', role: 'Supervisor' },
    { id: 4, name: 'Budi Nugraha', email: 'Nugraha@company.com', division: 'Finance', role: 'Staff' },
    { id: 5, name: 'Ani Ca', email: 'ani@company.com', division: 'HRD', role: 'Manager' },
    { id: 6, name: 'Dedi Pratama', email: 'dedi@company.com', division: 'Operasional', role: 'Supervisor' },
  ]);

  // Hitung Statistik
  const totalUsers = users.length;
  const totalDivisions = new Set(users.map((u) => u.division)).size;
  const totalRoles = new Set(users.map((u) => u.role)).size;

  // Columns tabel
  const columns = [
    { title: 'Nama', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Divisi', dataIndex: 'division', key: 'division' },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => <Tag color="blue">{role}</Tag>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            icon={<EditOutlined />}
            type="primary"
            onClick={() => handleEdit(record)}
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record.id)}
          />
        </div>
      ),
    },
  ];

  // FilteredData
  const filteredData = users.filter(
    (item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.email.toLowerCase().includes(searchText.toLowerCase()) ||
      item.division.toLowerCase().includes(searchText.toLowerCase()) ||
      item.role.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleAdd = () => {
    setEditData(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditData(record);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setUsers(users.filter((u) => u.id !== id));
    message.success('User berhasil dihapus');
  };

  const handleSave = (values) => {
    if (editData) {
      setUsers(users.map((u) => (u.id === editData.id ? { ...editData, ...values } : u)));
      message.success('User berhasil diupdate');
    } else {
      const newUser = { id: Date.now(), ...values };
      setUsers([...users, newUser]);
      message.success('User berhasil ditambahkan');
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600">Manage Users</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Add User
        </Button>
      </div>

      {/* STATISTIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Total Staff */}
        <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4 border-l-4 border-blue-500">
          <TeamOutlined className="text-4xl text-blue-500" />
          <div>
            <p className="text-gray-500 text-sm">Total Users</p>
            <h2 className="text-2xl font-bold">{totalUsers}</h2>
          </div>
        </div>

        {/* Total Divisions */}
        <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4 border-l-4 border-green-500">
          <ApartmentOutlined className="text-4xl text-green-500" />
          <div>
            <p className="text-gray-500 text-sm">Total Divisions</p>
            <h2 className="text-2xl font-bold">{totalDivisions}</h2>
          </div>
        </div>

        {/* Total Roles */}
        <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4 border-l-4 border-purple-500">
          <CrownOutlined className="text-4xl text-purple-500" />
          <div>
            <p className="text-gray-500 text-sm">Total Roles</p>
            <h2 className="text-2xl font-bold">{totalRoles}</h2>
          </div>
        </div>
      </div>

      {/* Seacrh Bar Global  */}
      {/* SEARCH BAR GLOBAL */}
      <Input.Search
        placeholder="Cari karyawan..."
        allowClear
        onChange={(e) => setSearchText(e.target.value)}
        className=" mb-2 max-w-sm"
      />

      {/* TABLE */}
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        className="bg-white p-4 rounded-xl shadow"
      />

      {/* MODAL */}
      <Modal
        title={editData ? 'Edit User' : 'Add User'}
        open={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
      >
        <FormAddStaff
          initialValues={editData}
          onSubmit={handleSave}
        />
      </Modal>
    </div>
  );
}
