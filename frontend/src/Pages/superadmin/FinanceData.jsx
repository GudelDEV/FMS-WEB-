import { useState } from 'react';
import { Table, Tag, Input, Button, Space, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import FilterPeriode from '../../Components/FilterPeriode';
import SummaryCard from '../../Components/cards/SummaryCard';
import BarDivisiChart from '../../Components/charts/BarDivisiChart';
import { financeData } from '../../data/financeDummy';

export default function FinanceData() {
  const [periode, setPeriode] = useState('monthly');
  const [searchText, setSearchText] = useState('');

  const data = financeData[periode];

  // Filtered Data
  const filteredData = data.filter((item) => {
    return (
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      String(item.pemasukan).includes(searchText) ||
      String(item.pengeluaran).includes(searchText)
    );
  });

  // Summary calculation
  const totalPemasukan = data.reduce((sum, item) => sum + item.pemasukan, 0);
  const totalPengeluaran = data.reduce((sum, item) => sum + item.pengeluaran, 0);
  const saldo = totalPemasukan - totalPengeluaran;

  // Table columns
  const columns = [
    { title: 'Tanggal', dataIndex: 'tanggal', key: 'tanggal' },
    { title: 'Divisi', dataIndex: 'name', key: 'name' },
    {
      title: 'Kategori',
      dataIndex: 'kategori',
      key: 'kategori',
      render: (val) => <Tag color={val === 'Pemasukan' ? 'green' : 'red'}>{val}</Tag>,
    },
    {
      title: 'Pemasukan',
      dataIndex: 'pemasukan',
      key: 'pemasukan',
      render: (val) => <Tag color="green">Rp {val.toLocaleString('id-ID')}</Tag>,
    },
    {
      title: 'Pengeluaran',
      dataIndex: 'pengeluaran',
      key: 'pengeluaran',
      render: (val) => <Tag color="red">Rp {val.toLocaleString('id-ID')}</Tag>,
    },
    {
      title: 'Saldo Divisi',
      key: 'saldo',
      render: (_, record) => {
        const s = record.pemasukan - record.pengeluaran;
        return <Tag color={s >= 0 ? 'blue' : 'orange'}>Rp {s.toLocaleString('id-ID')}</Tag>;
      },
    },
    {
      title: 'Aksi',
      key: 'aksi',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => message.info(`Edit data ${record.name}`)}
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => message.warning(`Hapus data ${record.name}`)}
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-indigo-600">Finance Data</h1>

        <FilterPeriode
          periode={periode}
          onChange={(val) => setPeriode(val)}
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <SummaryCard
          title="Total Pemasukan"
          value={`Rp ${totalPemasukan.toLocaleString('id-ID')}`}
          className="border-green-500 text-green-600"
        />
        <SummaryCard
          title="Total Pengeluaran"
          value={`Rp ${totalPengeluaran.toLocaleString('id-ID')}`}
          className="border-red-500 text-red-600"
        />
        <SummaryCard
          title="Saldo"
          value={`Rp ${saldo.toLocaleString('id-ID')}`}
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
          dataSource={filteredData}
          pagination={{ pageSize: 5 }}
          rowKey={(record) => record.id || record.name + record.tanggal}
          scroll={{ x: 'max-content' }}
        />
      </div>
    </>
  );
}
