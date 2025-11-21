/* eslint-disable no-unused-vars */
// Components/Karyawan/GajiKaryawan.jsx
import { useState, useEffect } from 'react';
import { Button, Table, Input, Badge, Form, Card } from 'antd';

export default function GajiKaryawan({ karyawan }) {
  const [gajiList, setGajiList] = useState(karyawan?.gaji || []);

  const [form] = Form.useForm();

  // Default gaji pokok jika sudah pernah diset pada karyawan
  const [gajiPokok, setGajiPokok] = useState(karyawan?.gajiPokok || 0);

  const submitGaji = (values) => {
    const total = Number(values.gajiPokok) + Number(values.dinasLuarKota || 0) + Number(values.tambahanLain || 0);

    const newData = {
      id: Date.now(),
      bulan: values.bulan,
      gajiPokok: Number(values.gajiPokok),
      dinasLuarKota: Number(values.dinasLuarKota || 0),
      tambahanLain: Number(values.tambahanLain || 0),
      total,
      status: 'Belum Dibayar',
      bukti: null,
    };

    // Simpan ke list
    setGajiList([...gajiList, newData]);

    // Simpan gaji pokok baru (jika diubah)
    setGajiPokok(Number(values.gajiPokok));

    form.resetFields();
  };

  const columns = [
    { title: 'Bulan', dataIndex: 'bulan' },
    { title: 'Gaji Pokok', dataIndex: 'gajiPokok', render: (v) => `Rp ${v.toLocaleString()}` },
    { title: 'Dinas Luar Kota', dataIndex: 'dinasLuarKota', render: (v) => `Rp ${v.toLocaleString()}` },
    { title: 'Tambahan Lain', dataIndex: 'tambahanLain', render: (v) => `Rp ${v.toLocaleString()}` },
    { title: 'Total', dataIndex: 'total', render: (v) => <b>Rp {v.toLocaleString()}</b> },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) =>
        status === 'Dibayar' ? (
          <Badge
            status="success"
            text="Dibayar"
          />
        ) : (
          <Badge
            status="error"
            text="Belum Dibayar"
          />
        ),
    },
    {
      title: 'Bukti Pembayaran',
      dataIndex: 'bukti',
      render: (file) =>
        file ? (
          <a
            href={`/${file}`}
            target="_blank"
            className="text-blue-600 underline"
          >
            Lihat Bukti
          </a>
        ) : (
          <span className="text-gray-500 italic">Belum ada bukti</span>
        ),
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Pengaturan Gaji — {karyawan?.nama}</h2>

      {/* Form Gaji */}
      <Card className="mb-5 shadow">
        <Form
          form={form}
          layout="vertical"
          onFinish={submitGaji}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* BULAN */}
            <Form.Item
              label="Bulan"
              name="bulan"
              rules={[{ required: true, message: 'Bulan wajib diisi' }]}
            >
              <Input placeholder="Contoh: Januari 2025" />
            </Form.Item>

            {/* GAJI POKOK */}
            <Form.Item
              label="Gaji Pokok"
              name="gajiPokok"
              initialValue={gajiPokok}
              rules={[{ required: true, message: 'Gaji pokok wajib diisi' }]}
            >
              <Input
                placeholder="Masukkan gaji pokok"
                type="number"
              />
            </Form.Item>

            {/* DINAS LUAR KOTA */}
            <Form.Item
              label="Gaji Dinas Luar Kota"
              name="dinasLuarKota"
            >
              <Input
                placeholder="Opsional"
                type="number"
              />
            </Form.Item>

            {/* TAMBAHAN LAIN */}
            <Form.Item
              label="Tambahan Lain"
              name="tambahanLain"
            >
              <Input
                placeholder="Opsional"
                type="number"
              />
            </Form.Item>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            block
            className="mt-2"
          >
            Tambahkan Gaji Bulanan
          </Button>
        </Form>
      </Card>

      {/* Table Gaji */}
      <Table
        rowKey="id"
        columns={columns}
        dataSource={gajiList}
      />
    </div>
  );
}
