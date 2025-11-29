/* eslint-disable no-unused-vars */
// pages/ManageDivisions.jsx
import { useState, useEffect } from "react";
import { Button, Table, Modal, message, Input, Form } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ApartmentOutlined,
  UserOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { toast } from "react-toastify";
export default function ManageDivisions() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalMonthlyExpenses, setTotalMonthlyExpenses] = useState(0);
  // Dummy data divisi
  const [divisions, setDivisions] = useState([]);

  useEffect(() => {
    fetchDivisions();
  }, []);

  const fetchDivisions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/division", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res);
      const divisionsData = res.data.data; // <-- gunakan res.data.data
      setDivisions(divisionsData);

      // Hitung statistik dari data API
      const totalEmp = divisionsData.reduce(
        (sum, div) => sum + (div.totalEmployees || 0),
        0
      );
      const totalExp = divisionsData.reduce(
        (sum, div) => sum + (div.totalExpenses || 0),
        0
      );

      setTotalEmployees(totalEmp);
      setTotalMonthlyExpenses(totalExp);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Statistik
  const totalDivisions = divisions.length;

  // Total pengeluaran per divisi
  const expensesPerDivision = divisions.map((d) => {
    const totalExpenses =
      d.Transaksi?.reduce((sum, t) => sum + t.amount, 0) || 0;
    const totalEmployeesInDiv = d.staff?.length || 0;
    return { ...d, totalExpenses, totalEmployees: totalEmployeesInDiv };
  });

  // Columns tabel
  const columns = [
    { title: "Nama Divisi", dataIndex: "name", key: "name" },
    { title: "Deskripsi", dataIndex: "description", key: "description" },
    {
      title: "Total Pemasukan",
      dataIndex: "totalIncome",
      key: "totalIncome",
      render: (val) => `Rp ${Number(val || 0).toLocaleString()}`,
    },
    {
      title: "Total Pengeluaran",
      dataIndex: "totalExpenses",
      key: "totalExpenses",
      render: (val) => `Rp ${Number(val || 0).toLocaleString()}`,
    },
    {
      title: "Total Karyawan",
      dataIndex: "totalEmployees",
      key: "totalEmployees",
      render: (val) => val || 0,
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
  const filteredData = expensesPerDivision.filter(
    (item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      (item.description &&
        item.description.toLowerCase().includes(searchText.toLowerCase()))
  );

  // Handlers
  const handleAdd = () => {
    setEditData(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditData(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token"); // ambil token JWT
    try {
      // Panggil API untuk hapus divisi
      await axios.delete(`http://localhost:5000/api/division/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update state setelah berhasil dihapus
      setDivisions(divisions.filter((d) => d.id !== id));
      toast.success("Divisi berhasil dihapus");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Gagal menghapus divisi");
    }
  };

  const handleSave = async (values) => {
    const token = localStorage.getItem("token"); // ambil JWT
    try {
      if (editData) {
        // UPDATE divisi
        const res = await axios.put(
          `http://localhost:5000/api/division/${editData.id}`,
          values,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Update state
        setDivisions(
          divisions.map((d) => (d.id === editData.id ? res.data : d))
        );
        toast.success("Divisi berhasil diupdate");
      } else {
        console.log(values);

        // ADD divisi baru
        const res = await axios.post(
          "http://localhost:5000/api/division",
          values,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setDivisions([...divisions, res.data]);
        toast.success("Divisi berhasil ditambahkan");
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      message.error(err.response?.data?.message || "Terjadi kesalahan");
    }
  };
  // Form modal
  const DivisionForm = ({ initialValues, onSubmit }) => {
    const [form] = Form.useForm();
    return (
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={onSubmit}
      >
        <Form.Item
          label="Nama Divisi"
          name="name"
          rules={[{ required: true, message: "Masukkan nama divisi!" }]}
        >
          <Input placeholder="Finance / HRD / Operasional" />
        </Form.Item>

        <Form.Item label="Deskripsi" name="description">
          <Input.TextArea placeholder="Deskripsi singkat divisi" rows={3} />
        </Form.Item>

        <Form.Item className="text-right">
          <Button type="primary" htmlType="submit">
            {initialValues ? "Update" : "Add"}
          </Button>
        </Form.Item>
      </Form>
    );
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600">Manage Divisions</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Add Division
        </Button>
      </div>

      {/* STATISTIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4 border-l-4 border-green-500">
          <ApartmentOutlined className="text-4xl text-green-500" />
          <div>
            <p className="text-gray-500 text-sm">Total Divisions</p>
            <h2 className="text-2xl font-bold">{totalDivisions}</h2>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4 border-l-4 border-blue-500">
          <UserOutlined className="text-4xl text-blue-500" />
          <div>
            <p className="text-gray-500 text-sm">Total Employees</p>
            <h2 className="text-2xl font-bold">{totalEmployees}</h2>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4 border-l-4 border-red-500">
          <DollarOutlined className="text-4xl text-red-500" />
          <div>
            <p className="text-gray-500 text-sm">Total Expenses This Month</p>
            <h2 className="text-2xl font-bold">
              Rp {totalMonthlyExpenses.toLocaleString()}
            </h2>
          </div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <Input.Search
        placeholder="Cari divisi..."
        allowClear
        onChange={(e) => setSearchText(e.target.value)}
        className="mb-4 max-w-sm"
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
        title={editData ? "Edit Division" : "Add Division"}
        open={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
      >
        <DivisionForm initialValues={editData} onSubmit={handleSave} />
      </Modal>
    </div>
  );
}
