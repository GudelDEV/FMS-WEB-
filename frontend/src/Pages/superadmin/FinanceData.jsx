/* eslint-disable react-hooks/immutability */
import { useState, useEffect } from "react";
import { Table, Tag, Input, Button, Space, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import FilterPeriode from "../../Components/FilterPeriode";
import SummaryCard from "../../Components/cards/SummaryCard";
import BarDivisiChart from "../../Components/charts/BarDivisiChart";
import axios from "axios";
import { toast } from "react-toastify";

export default function FinanceData() {
  const [periode, setPeriode] = useState("monthly");
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState([]);

  // Fetch real-time dari backend
  useEffect(() => {
    fetchFinance();
  }, [periode]);

  const fetchFinance = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/finance/periode/${periode}`
      );
      setData(res.data.data || []);
    } catch (err) {
      console.log(err);
      toast.error("Gagal mengambil data finance");
    }
  };

  // Filter pencarian (datar transaksi)
  const filtered = data.flatMap((div) =>
    (div.details || [])
      .filter(
        (item) =>
          item.staff.divisi.name
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          String(item.amount).includes(searchText)
      )
      .map((item) => ({
        ...item,
        divisi: item.staff.divisi.name,
        tanggal: new Date(item.createdAt).toLocaleDateString("id-ID"),
        kategori: item.type === "pemasukan" ? "Pemasukan" : "Pengeluaran",
        pemasukan: item.type === "pemasukan" ? item.amount : 0,
        pengeluaran: item.type === "pengeluaran" ? item.amount : 0,
      }))
  );

  // Summary calculation
  const totalPemasukan = data.reduce((sum, d) => sum + d.pemasukan, 0);
  const totalPengeluaran = data.reduce((sum, d) => sum + d.pengeluaran, 0);
  const saldo = totalPemasukan - totalPengeluaran;

  // Table Columns
  const columns = [
    { title: "Tanggal", dataIndex: "tanggal" },
    { title: "Divisi", dataIndex: "divisi" },
    {
      title: "Kategori",
      dataIndex: "kategori",
      render: (val) => (
        <Tag color={val === "Pemasukan" ? "green" : "red"}>{val}</Tag>
      ),
    },
    {
      title: "Pemasukan",
      dataIndex: "pemasukan",
      render: (val) =>
        val > 0 && <Tag color="green">Rp {val.toLocaleString()}</Tag>,
    },
    {
      title: "Pengeluaran",
      dataIndex: "pengeluaran",
      render: (val) =>
        val > 0 && <Tag color="red">Rp {val.toLocaleString()}</Tag>,
    },
    {
      title: "Saldo",
      render: (_, record) => {
        const s = record.pemasukan - record.pengeluaran;
        return (
          <Tag color={s >= 0 ? "blue" : "orange"}>Rp {s.toLocaleString()}</Tag>
        );
      },
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-indigo-600">Finance Data</h1>

        <FilterPeriode periode={periode} onChange={(val) => setPeriode(val)} />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <SummaryCard
          title="Total Pemasukan"
          value={`Rp ${totalPemasukan.toLocaleString("id-ID")}`}
          className="border-green-500 text-green-600"
        />
        <SummaryCard
          title="Total Pengeluaran"
          value={`Rp ${totalPengeluaran.toLocaleString("id-ID")}`}
          className="border-red-500 text-red-600"
        />
        <SummaryCard
          title="Saldo"
          value={`Rp ${saldo.toLocaleString("id-ID")}`}
          className="border-blue-500 text-blue-600"
        />
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Grafik Per Divisi</h2>
        <BarDivisiChart data={data} />
      </div>

      {/* Search & Table */}
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Detail Keuangan</h2>
          <Input.Search
            placeholder="Cari divisi, tanggal, nominal..."
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <Table
          columns={columns}
          dataSource={filtered}
          pagination={{ pageSize: 5 }}
          rowKey="id"
          scroll={{ x: "max-content" }}
        />
      </div>
    </>
  );
}
