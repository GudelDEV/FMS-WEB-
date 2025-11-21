import React, { useState } from 'react';
import { Table, Button, Tag, Modal, Card, Row, Col, message, Upload, Input, Form } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

export default function GajihKaryawanBendahara() {
  const [gajiList, setGajiList] = useState([
    {
      id: 1,
      nama: 'Andi Saputra',
      divisi: 'Finance',
      gaji: 15000000,
      tunjangan: 2000000,
      potongan: 500000,
      status: 'Belum Dibayar',
      bukti: null,
    },
    {
      id: 2,
      nama: 'Budi Prakoso',
      divisi: 'HRD',
      gaji: 12000000,
      tunjangan: 1000000,
      potongan: 300000,
      status: 'Sudah Dibayar',
      bukti: null,
    },
    {
      id: 3,
      nama: 'Citra Dewi',
      divisi: 'Operasional',
      gaji: 10000000,
      tunjangan: 1500000,
      potongan: 200000,
      status: 'Belum Dibayar',
      bukti: null,
    },
  ]);

  const [detailModal, setDetailModal] = useState({ visible: false, data: null });
  const [bayarModal, setBayarModal] = useState({ visible: false, data: null });
  const [buktiFile, setBuktiFile] = useState(null);
  const [catatan, setCatatan] = useState(''); // Form tambahan untuk bendahara

  const openBayarModal = (record) => {
    setBayarModal({ visible: true, data: record });
    setBuktiFile(record.bukti || null);
    setCatatan(record.catatan || '');
  };

  const submitBayar = () => {
    if (!buktiFile) {
      message.error('Bukti pembayaran wajib diupload!');
      return;
    }
    setGajiList((prev) =>
      prev.map((item) =>
        item.id === bayarModal.data.id ? { ...item, status: 'Sudah Dibayar', bukti: buktiFile, catatan } : item
      )
    );
    message.success('Gaji berhasil dibayarkan');
    setBayarModal({ visible: false, data: null });
    setBuktiFile(null);
    setCatatan('');
  };

  const columns = [
    { title: 'Nama', dataIndex: 'nama', key: 'nama' },
    { title: 'Divisi', dataIndex: 'divisi', key: 'divisi' },
    { title: 'Gaji Pokok', dataIndex: 'gaji', key: 'gaji', render: (v) => `Rp ${v.toLocaleString()}` },
    { title: 'Tunjangan', dataIndex: 'tunjangan', key: 'tunjangan', render: (v) => `Rp ${v.toLocaleString()}` },
    { title: 'Potongan', dataIndex: 'potongan', key: 'potongan', render: (v) => `Rp ${v.toLocaleString()}` },
    {
      title: 'Total',
      key: 'total',
      render: (_, record) => {
        const total = record.gaji + record.tunjangan - record.potongan;
        return <b>Rp {total.toLocaleString()}</b>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={status === 'Belum Dibayar' ? 'orange' : 'green'}>{status}</Tag>,
    },
    {
      title: 'Aksi',
      key: 'aksi',
      render: (_, record) => (
        <>
          {record.status === 'Belum Dibayar' && (
            <Button
              type="primary"
              onClick={() => openBayarModal(record)}
            >
              Bayar
            </Button>
          )}
          <Button
            style={{ marginLeft: 8 }}
            onClick={() => setDetailModal({ visible: true, data: record })}
          >
            Detail
          </Button>
        </>
      ),
    },
  ];

  const totalKaryawan = gajiList.length;
  const totalBelumBayar = gajiList.filter((g) => g.status === 'Belum Dibayar').length;
  const totalSudahBayar = gajiList.filter((g) => g.status === 'Sudah Dibayar').length;
  const totalGajiDibayarkan = gajiList
    .filter((g) => g.status === 'Sudah Dibayar')
    .reduce((sum, g) => sum.gaji + g.tunjangan - g.potongan, 0);

  return (
    <div>
      <h1 className="text-3xl font-bold text-indigo-600 mb-6">Pembayaran Gaji Karyawan</h1>

      <Row
        gutter={16}
        className="mb-6"
      >
        <Col>
          <Card title="Total Karyawan">{totalKaryawan}</Card>
        </Col>
        <Col>
          <Card title="Gaji Belum Dibayarkan">{totalBelumBayar}</Card>
        </Col>
        <Col>
          <Card title="Gaji Sudah Dibayar">{totalSudahBayar}</Card>
        </Col>
        <Col>
          <Card title="Total Gaji Dibayarkan">Rp {totalGajiDibayarkan}</Card>
        </Col>
      </Row>

      <Table
        dataSource={gajiList}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />

      {/* Modal Detail */}
      <Modal
        title="Detail Gaji"
        visible={detailModal.visible}
        onCancel={() => setDetailModal({ visible: false, data: null })}
        footer={null}
      >
        {detailModal.data && (
          <div>
            <p>
              <b>Nama:</b> {detailModal.data.nama}
            </p>
            <p>
              <b>Divisi:</b> {detailModal.data.divisi}
            </p>
            <p>
              <b>Gaji Pokok:</b> Rp {detailModal.data.gaji.toLocaleString()}
            </p>
            <p>
              <b>Tunjangan:</b> Rp {detailModal.data.tunjangan.toLocaleString()}
            </p>
            <p>
              <b>Potongan:</b> Rp {detailModal.data.potongan.toLocaleString()}
            </p>
            <p>
              <b>Total:</b> Rp{' '}
              {(detailModal.data.gaji + detailModal.data.tunjangan - detailModal.data.potongan).toLocaleString()}
            </p>
            <p>
              <b>Status:</b> {detailModal.data.status}
            </p>
            <p>
              <b>Catatan Bendahara:</b> {detailModal.data.catatan || '-'}
            </p>
            <p>
              <b>Bukti Pembayaran:</b>{' '}
              {detailModal.data.bukti ? (
                <a
                  href={URL.createObjectURL(detailModal.data.bukti)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Lihat Bukti
                </a>
              ) : (
                <span className="text-gray-500 italic">Belum ada bukti</span>
              )}
            </p>
          </div>
        )}
      </Modal>

      {/* Modal Bayar */}
      <Modal
        title={`Bayar Gaji — ${bayarModal.data?.nama}`}
        visible={bayarModal.visible}
        onCancel={() => setBayarModal({ visible: false, data: null })}
        onOk={submitBayar}
        okText="Bayar"
      >
        <Form layout="vertical">
          <Form.Item label="Catatan (opsional)">
            <Input.TextArea
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Catatan bendahara..."
            />
          </Form.Item>
          <Upload
            beforeUpload={(file) => {
              setBuktiFile(file);
              return false;
            }}
            fileList={buktiFile ? [buktiFile] : []}
            onRemove={() => setBuktiFile(null)}
            listType="picture"
          >
            <Button icon={<UploadOutlined />}>Upload Bukti Pembayaran</Button>
          </Upload>
        </Form>
      </Modal>
    </div>
  );
}
