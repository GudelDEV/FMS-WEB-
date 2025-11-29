// pages/ManageUsers.jsx
import { useState } from "react";
import { Button, Table, Tag, Modal, message, Input } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  TeamOutlined,
  ApartmentOutlined,
  CrownOutlined,
} from "@ant-design/icons";
import FormAddStaff from "../../Components/form/FormAddStaff";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function ManageUsers() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [divisions, setDivisions] = useState([]); // state khusus untuk divisi
  const [users, setUsers] = useState([]);
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res);
      setUsers(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengambil data users");
    }
  };

  const fetchDivisions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/division/select", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res);
      setDivisions(res.data.data); // <-- perbaikan: simpan ke state divisions
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengambil data divisions");
    }
  };
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDivisions();
    fetchUsers();
  }, []);

  // Hitung Statistik
  const totalUsers = users.length;
  const totalDivisions = new Set(users.map((u) => u.division)).size;
  const totalRoles = new Set(users.map((u) => u.role)).size;

  // Columns tabel
  const columns = [
    { title: "Nama", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Divisi", dataIndex: "division", key: "division" },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => <Tag color="blue">{role}</Tag>,
    },
    {
      title: "Action",
      key: "action",
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

  const handleDelete = async (id) => {
    if (!id) return toast.error("Data dengan" + id + "tidak ditemukan");
    console.log(id);
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/users/${id}`
      );
      console.log(response);

      fetchUsers();
      toast.success("Data Berhasil Dihapus");
    } catch (error) {
      console.log(error);
      toast.error("Gagagal Menghapus data");
    }
  };

  const handleSave = async (values) => {
    console.log(values);

    const token = localStorage.getItem("token"); // ambil token kalau pakai auth
    try {
      if (editData) {
        // UPDATE user
        const res = await axios.put(
          `http://localhost:5000/api/users/${editData.id}`,
          values,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // update state users
        setUsers(users.map((u) => (u.id === editData.id ? res.data.data : u)));
        toast.success("User berhasil diupdate");
      } else {
        // ADD user
        const res = await axios.post(
          "http://localhost:5000/api/users",
          values,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(res);
        // tambahkan user baru ke state
        setUsers([...users, res.data.data]);
        toast.success("User berhasil ditambahkan");
      }

      // tutup modal
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Gagal menyimpan user");
    }
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600">Manage Users</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
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
        title={editData ? "Edit User" : "Add User"}
        open={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
      >
        <FormAddStaff
          initialValues={editData}
          onSubmit={handleSave}
          divisions={divisions}
        />
      </Modal>
    </div>
  );
}
