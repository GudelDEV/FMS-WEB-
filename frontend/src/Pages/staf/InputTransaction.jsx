// pages/staff/InputTransaksiPage.jsx
import React, { useState } from 'react';
import { Table, Input, Button, Select, Tag, DatePicker, Upload, message, Modal, Card, Row, Col, Space } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;

export default function InputTransaksiPage() {
  const currentUser = 'Andi Saputra'; // simulasi staff yang login

  // State transaksi
  const [transaksi, setTransaksi] = useState([
    {
      id: 1,
      staf: 'Andi Saputra',
      divisi: 'Finance',
      jenis: 'Pemasukan',
      nominal: 5000000,
      tanggal: moment('2025-11-01'),
      status: 'Pending',
      catatan: 'Gaji bulan November',
      bukti: [],
    },
    {
      id: 2,
      staf: 'Budi Prakoso',
      divisi: 'HRD',
      jenis: 'Pengeluaran',
      nominal: 1200000,
      tanggal: moment('2025-11-03'),
      status: 'Approved',
      catatan: 'Listrik kantor',
      bukti: [],
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    staf: currentUser,
    divisi: '',
    jenis: 'Pemasukan',
    nominal: '',
    tanggal: moment(),
    catatan: '',
    bukti: [],
  });
  const [detailModal, setDetailModal] = useState({ visible: false, data: null });

  // Tambah transaksi baru / edit
  const saveTransaksi = () => {
    if (!form.divisi || !form.nominal) {
      message.error('Divisi dan Nominal wajib diisi');
      return;
    }

    if (editingId) {
      setTransaksi((prev) =>
        prev.map((t) => (t.id === editingId ? { ...t, ...form, nominal: Number(form.nominal) } : t))
      );
      message.success('Transaksi berhasil diperbarui');
    } else {
      const newItem = {
        ...form,
        id: transaksi.length + 1,
        nominal: Number(form.nominal),
        status: 'Pending',
      };
      setTransaksi([newItem, ...transaksi]);
      message.success('Transaksi berhasil ditambahkan');
    }

    setForm({ ...form, divisi: '', jenis: 'Pemasukan', nominal: '', catatan: '', bukti: [] });
    setEditingId(null);
    setModalVisible(false);
  };

  const startEdit = (record) => {
    if (record.status !== 'Pending') {
      message.warning('Transaksi sudah di-approve/reject, tidak bisa diedit.');
      return;
    }
    setEditingId(record.id);
    setForm({ ...record });
    setModalVisible(true);
  };

  const columns = [
    { title: 'Divisi', dataIndex: 'divisi', key: 'divisi' },
    { title: 'Jenis', dataIndex: 'jenis', key: 'jenis' },
    {
      title: 'Nominal',
      dataIndex: 'nominal',
      key: 'nominal',
      render: (val) => `Rp ${val.toLocaleString()}`,
    },
    {
      title: 'Tanggal',
      dataIndex: 'tanggal',
      key: 'tanggal',
      render: (date) => date.format('YYYY-MM-DD'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const color = status === 'Pending' ? 'orange' : status === 'Approved' ? 'green' : 'red';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Aksi',
      key: 'aksi',
      render: (_, record) => (
        <Space>
          {record.status === 'Pending' && <Button onClick={() => startEdit(record)}>Edit</Button>}
          <Button onClick={() => setDetailModal({ visible: true, data: record })}>Detail</Button>
        </Space>
      ),
    },
  ];

  // Hitung summary
  const totalTransaksi = transaksi.filter((t) => t.staf === currentUser).length;
  const totalPemasukan = transaksi
    .filter((t) => t.staf === currentUser && t.jenis === 'Pemasukan')
    .reduce((sum, t) => sum + t.nominal, 0);
  const totalPengeluaran = transaksi
    .filter((t) => t.staf === currentUser && t.jenis === 'Pengeluaran')
    .reduce((sum, t) => sum + t.nominal, 0);

  return (
    <div>
      <h1 className="text-3xl font-bold text-indigo-600 mb-6">Dashboard Bendahara</h1>

      {/* Summary Card */}
      <Row
        gutter={16}
        className="mb-6"
      >
        <Col>
          <Card
            title="Total Transaksi"
            bordered
          >
            {totalTransaksi}
          </Card>
        </Col>
        <Col>
          <Card
            title="Total Pemasukan"
            bordered
          >
            Rp {totalPemasukan.toLocaleString()}
          </Card>
        </Col>
        <Col>
          <Card
            title="Total Pengeluaran"
            bordered
          >
            Rp {totalPengeluaran.toLocaleString()}
          </Card>
        </Col>
      </Row>

      {/* Button tambah */}
      <Button
        type="primary"
        className="mb-4"
        onClick={() => setModalVisible(true)}
      >
        Tambah Transaksi
      </Button>

      {/* Table */}
      <Table
        dataSource={transaksi.filter((t) => t.staf === currentUser)}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />

      {/* Modal Form */}
      <Modal
        title={editingId ? 'Edit Transaksi' : 'Tambah Transaksi'}
        visible={modalVisible}
        onOk={saveTransaksi}
        onCancel={() => setModalVisible(false)}
        okText="Simpan"
      >
        <Select
          value={form.divisi}
          onChange={(val) => setForm({ ...form, divisi: val })}
          placeholder="Pilih Divisi"
          style={{ width: '100%', marginBottom: 10 }}
        >
          <Option value="Finance">Finance</Option>
          <Option value="HRD">HRD</Option>
          <Option value="Operasional">Operasional</Option>
        </Select>

        <Select
          value={form.jenis}
          onChange={(val) => setForm({ ...form, jenis: val })}
          style={{ width: '100%', marginBottom: 10 }}
        >
          <Option value="Pemasukan">Pemasukan</Option>
          <Option value="Pengeluaran">Pengeluaran</Option>
        </Select>

        <Input
          type="number"
          placeholder="Nominal"
          value={form.nominal}
          onChange={(e) => setForm({ ...form, nominal: e.target.value })}
          style={{ width: '100%', marginBottom: 10 }}
        />

        <DatePicker
          value={form.tanggal}
          onChange={(date) => setForm({ ...form, tanggal: date })}
          style={{ width: '100%', marginBottom: 10 }}
        />

        <TextArea
          placeholder="Catatan"
          value={form.catatan}
          onChange={(e) => setForm({ ...form, catatan: e.target.value })}
          rows={3}
          style={{ marginBottom: 10 }}
        />

        <Upload
          multiple
          listType="picture-card" // tampil sebagai thumbnail
          beforeUpload={(file) => {
            const newFile = {
              uid: file.uid,
              name: file.name,
              status: 'done',
              originFileObj: file, // ini penting supaya bisa di preview
              url: URL.createObjectURL(file), // buat preview thumbnail
            };
            setForm({ ...form, bukti: [...form.bukti, newFile] });
            return false; // jangan auto upload
          }}
          fileList={form.bukti}
          onRemove={(file) => {
            setForm({
              ...form,
              bukti: form.bukti.filter((f) => f.uid !== file.uid),
            });
          }}
          onPreview={(file) => {
            const src = file.url || file.preview || URL.createObjectURL(file.originFileObj);
            Modal.info({
              title: 'Preview Invoice',
              content: (
                <img
                  src={src}
                  style={{ width: '100%' }}
                />
              ),
              width: 600,
              okText: 'Tutup',
            });
          }}
        >
          <div>
            <UploadOutlined />
            <div style={{ marginTop: 8 }}>Upload Bukti</div>
          </div>
        </Upload>
      </Modal>

      {/* Modal Detail */}
      <Modal
        title="Detail Transaksi"
        visible={detailModal.visible}
        onCancel={() => setDetailModal({ visible: false, data: null })}
        footer={null}
      >
        {detailModal.data && (
          <div>
            <p>
              <b>Divisi:</b> {detailModal.data.divisi}
            </p>
            <p>
              <b>Jenis:</b> {detailModal.data.jenis}
            </p>
            <p>
              <b>Nominal:</b> Rp {detailModal.data.nominal.toLocaleString()}
            </p>
            <p>
              <b>Tanggal:</b> {detailModal.data.tanggal.format('YYYY-MM-DD')}
            </p>
            <p>
              <b>Status:</b> {detailModal.data.status}
            </p>
            <p>
              <b>Catatan:</b> {detailModal.data.catatan}
            </p>
            <p>
              <b>Bukti:</b>
            </p>
            {detailModal.data.bukti.length > 0 ? (
              detailModal.data.bukti.map((file, idx) => <div key={idx}>{file.name}</div>)
            ) : (
              <p>-</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
