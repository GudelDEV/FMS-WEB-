// Pages/DataKaryawan.jsx
import { useState } from 'react';
import { Button, Table, Modal, Card, Input } from 'antd';
import AddKaryawanForm from '../../Components/form/AddKaryawanForm.jsx';
import EditKaryawanForm from '../../Components/form/EditKaryawanForm.jsx';
import GajiKaryawan from '../../Components/form/GajiKaryawan.jsx';
import SummaryCard from '../../Components/cards/SummaryCard.jsx';
import { Pie } from '@ant-design/plots';

export default function DataKaryawan() {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openGaji, setOpenGaji] = useState(false);
  const [selectedKaryawan, setSelectedKaryawan] = useState(null);
  const [searchText, setSearchText] = useState('');

  // ==============================
  // DUMMY DATA (sesuai struktur baru)
  // ==============================
  const [data, setData] = useState([
    {
      id: 1,
      nama: 'Andi Saputra',
      email: 'andi@mail.com',
      divisi: 'Finance',
      posisi: 'Staff Finance',
      gajiPokok: 5000000,
      gaji: [
        {
          id: 11,
          bulan: 'Januari 2025',
          gajiPokok: 5000000,
          dinasLuarKota: 0,
          tambahanLain: 0,
          total: 5000000,
          status: 'Dibayar',
          bukti: 'bukti-andi.jpg',
        },
      ],
    },
    {
      id: 2,
      nama: 'Budi Prakoso',
      email: 'budi@mail.com',
      divisi: 'HRD',
      posisi: 'Staff HRD',
      gajiPokok: 4800000,
      gaji: [
        {
          id: 12,
          bulan: 'Januari 2025',
          gajiPokok: 4800000,
          dinasLuarKota: 0,
          tambahanLain: 0,
          total: 4800000,
          status: 'Belum Dibayar',
          bukti: null,
        },
      ],
    },
  ]);

  // ==============================
  // SUMMARY
  // ==============================
  const totalKaryawan = data.length;

  const totalGaji = data.reduce((sum, k) => {
    const latest = k.gaji?.[k.gaji.length - 1];
    return sum + (latest?.total || 0);
  }, 0);

  const sudahDibayar = data.filter((k) => k.gaji?.[0]?.status === 'Dibayar').length;
  const belumDibayar = totalKaryawan - sudahDibayar;

  const pieData = [
    { type: 'Sudah Dibayar', value: sudahDibayar },
    { type: 'Belum Dibayar', value: belumDibayar },
  ];

  // ==============================
  // TABLE COLUMNS
  // ==============================
  const columns = [
    { title: 'Nama', dataIndex: 'nama' },
    { title: 'Divisi', dataIndex: 'divisi' },
    { title: 'Posisi', dataIndex: 'posisi' },
    { title: 'Email', dataIndex: 'email' },
    {
      title: 'Gaji Pokok',
      dataIndex: 'gajiPokok',
      render: (v) => `Rp ${v.toLocaleString()}`,
    },
    {
      title: 'Aksi',
      render: (record) => (
        <div className="flex gap-2">
          {/* EDIT */}
          <Button
            type="primary"
            onClick={() => {
              setSelectedKaryawan(record);
              setOpenEdit(true);
            }}
          >
            Edit
          </Button>

          {/* HAPUS */}
          <Button
            danger
            onClick={() => setData(data.filter((d) => d.id !== record.id))}
          >
            Hapus
          </Button>

          {/* LIHAT GAJI */}
          <Button
            onClick={() => {
              setSelectedKaryawan(record);
              setOpenGaji(true);
            }}
          >
            Lihat Gaji
          </Button>
        </div>
      ),
    },
  ];

  // Filtered Data

  const filteredData = data.filter(
    (item) =>
      item.nama.toLowerCase().includes(searchText.toLowerCase()) ||
      item.email.toLowerCase().includes(searchText.toLowerCase()) ||
      item.divisi.toLowerCase().includes(searchText.toLowerCase()) ||
      item.posisi.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">Data Karyawan</h1>

      {/* ==============================
          SUMMARY CARDS
      ============================== */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <SummaryCard
          title="Total Karyawan"
          value={totalKaryawan}
          className="border-indigo-500"
        />
        <SummaryCard
          title="Total Gaji / Bulan"
          value={`Rp ${totalGaji.toLocaleString()}`}
          className="border-blue-500"
        />
        <SummaryCard
          title="Sudah Dibayar"
          value={sudahDibayar}
          className="border-green-500"
        />
        <SummaryCard
          title="Belum Dibayar"
          value={belumDibayar}
          className="border-red-500"
        />
      </div>

      {/* ==============================
          CHART
      ============================== */}
      <Card className="shadow-lg rounded-xl mb-6">
        <h3 className="font-semibold text-lg mb-3">Status Pembayaran Gaji Karyawan</h3>

        <Pie
          data={pieData}
          radius={0.9}
          angleField="value"
          colorField="type"
          label={{ type: 'outer', content: '{value}' }}
        />
      </Card>

      {/* ==============================
          BUTTON TAMBAH & Seacrh
      ============================== */}

      <section className="flex justify-between items-center mb-4 mt-4">
        {/* SEARCH BAR GLOBAL */}
        <Input.Search
          placeholder="Cari karyawan..."
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
          className="max-w-sm"
        />

        <Button
          type="primary"
          onClick={() => setOpenAdd(true)}
        >
          Tambah Karyawan
        </Button>
      </section>

      {/* ==============================
          TABLE
      ============================== */}
      <Table
        rowKey="id"
        columns={columns}
        dataSource={filteredData}
        className="bg-white rounded-xl shadow-md"
      />

      {/* ==============================
          MODAL ADD
      ============================== */}
      <Modal
        open={openAdd}
        onCancel={() => setOpenAdd(false)}
        footer={null}
      >
        <AddKaryawanForm
          setOpen={setOpenAdd}
          setData={setData}
          data={data}
        />
      </Modal>

      {/* ==============================
          MODAL EDIT
      ============================== */}
      <Modal
        open={openEdit}
        onCancel={() => setOpenEdit(false)}
        footer={null}
      >
        <EditKaryawanForm
          setOpen={setOpenEdit}
          setData={setData}
          data={data}
          selected={selectedKaryawan}
        />
      </Modal>

      {/* ==============================
          MODAL GAJI
      ============================== */}
      <Modal
        width={700}
        open={openGaji}
        onCancel={() => setOpenGaji(false)}
        footer={null}
      >
        <GajiKaryawan karyawan={selectedKaryawan} />
      </Modal>
    </div>
  );
}
