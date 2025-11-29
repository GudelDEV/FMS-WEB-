/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Tag,
  Modal,
  Card,
  Row,
  Col,
  message,
  Upload,
  Input,
  Form,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import axios from "axios";

export default function GajihKaryawanBendahara() {
  const [currentUser, setCurrentUser] = useState(null);
  const [gajiList, setGajiList] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { title: "Nama", dataIndex: "nama", key: "nama" },
    { title: "Divisi", dataIndex: "divisi", key: "divisi" },
    {
      title: "Gaji Pokok",
      dataIndex: "gajiPokok",
      key: "gajiPokok",
      render: (v) => `Rp ${v.toLocaleString()}`,
    },
    {
      title: "Tunjangan",
      dataIndex: "tunjangan",
      key: "tunjangan",
      render: (v) => `Rp ${v.toLocaleString()}`,
    },
    {
      title: "Potongan",
      dataIndex: "potongan",
      key: "potongan",
      render: (v) => `Rp ${v.toLocaleString()}`,
    },
    {
      title: "Total",
      key: "total",
      render: (_, record) => {
        const total = record.gajiPokok + record.tunjangan - record.potongan;
        return <b>Rp {total.toLocaleString()}</b>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Belum Dibayar" ? "orange" : "green"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Aksi",
      key: "aksi",
      render: (_, record) => (
        <>
          {record.status === "Belum Dibayar" && (
            <Button type="primary" onClick={() => openBayarModal(record)}>
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

  // Ambil data user login & setelah itu fetch gaji
  useEffect(() => {
    const getUserAndGaji = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get(
          "http://localhost:5000/api/login/staff-info",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const user = res.data.user;
        console.log(user.id);

        setCurrentUser(user);

        // Fetch gaji setelah user tersedia
        await fetchGaji(user.id);
      } catch (err) {
        console.error(err);
        toast.error("Gagal mengambil data user atau gaji");
        setLoading(false);
      }
    };

    getUserAndGaji();
  }, []);

  const fetchGaji = async (staffId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/gaji/by-staff/${staffId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const formatted = (res.data.gaji || []).map((g) => ({
        id: g.id,
        nama: g.karyawan?.name || "-",
        divisi: g.karyawan?.divisi?.name || "-",
        gajiPokok: g.gajiPokok || 0,
        tunjangan: g.DinasLuarKota || 0,
        potongan: g.potongan || 0,
        total: g.totalGaji || 0,
        status: g.status === "pending" ? "Belum Dibayar" : g.status,
        bulan: g.month || "-",
        catatan: g.catatan || "",
      }));

      console.log(res.data);

      setGajiList(formatted);
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengambil data gaji");
      setLoading(false);
    }
  };

  const [detailModal, setDetailModal] = useState({
    visible: false,
    data: null,
  });
  const [bayarModal, setBayarModal] = useState({ visible: false, data: null });
  const [buktiFile, setBuktiFile] = useState(null);
  const [catatan, setCatatan] = useState("");

  const openBayarModal = (record) => {
    setBayarModal({ visible: true, data: record });
    setCatatan(record.catatan || "");
  };
  const submitBayar = async () => {
    if (!buktiFile) {
      toast.error("Bukti pembayaran wajib diupload!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("buktiPembayaran", buktiFile);
      formData.append("catatan", catatan);

      const token = localStorage.getItem("token");

      const res = await axios.put(
        `http://localhost:5000/api/gaji/bayar/${bayarModal.data.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update state frontend
      setGajiList((prev) =>
        prev.map((item) =>
          item.id === bayarModal.data.id
            ? {
                ...item,
                status: "Sudah Dibayar",
                catatan,
                bukti: buktiFile.name,
              }
            : item
        )
      );

      toast.success("Gaji berhasil dibayarkan!");

      setBayarModal({ visible: false, data: null });
      setBuktiFile(null);
      setCatatan("");
    } catch (err) {
      console.error(err);
      toast.error("Gagal membayar gaji!");
    }
  };

  const totalKaryawan = gajiList.length;
  const totalBelumBayar = gajiList.filter(
    (g) => g.status === "Belum Dibayar"
  ).length;
  const totalSudahBayar = gajiList.filter(
    (g) => g.status === "Sudah Dibayar"
  ).length;
  const totalGajiDibayarkan = gajiList
    .filter((g) => g.status === "Sudah Dibayar")
    .reduce((sum, g) => sum + (g.gajiPokok + g.tunjangan - g.potongan), 0);

  return (
    <div>
      <h1 className="text-3xl font-bold text-indigo-600 mb-6">
        Pembayaran Gaji Karyawan
      </h1>

      <Row gutter={16} className="mb-6">
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
          <Card title="Total Gaji Dibayarkan">
            Rp {totalGajiDibayarkan.toLocaleString()}
          </Card>
        </Col>
      </Row>

      <Table
        dataSource={gajiList}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        loading={loading}
      />

      {/* Modal Detail */}
      <Modal
        title="Detail Gaji"
        open={detailModal.visible}
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
              <b>Gaji Pokok:</b> Rp{" "}
              {detailModal.data.gajiPokok.toLocaleString()}
            </p>
            <p>
              <b>Tunjangan:</b> Rp {detailModal.data.tunjangan.toLocaleString()}
            </p>
            <p>
              <b>Potongan:</b> Rp {detailModal.data.potongan.toLocaleString()}
            </p>
            <p>
              <b>Total:</b> Rp{" "}
              {(
                detailModal.data.gajiPokok +
                detailModal.data.tunjangan -
                detailModal.data.potongan
              ).toLocaleString()}
            </p>
            <p>
              <b>Status:</b> {detailModal.data.status}
            </p>
            <p>
              <b>Catatan Bendahara:</b> {detailModal.data.catatan || "-"}
            </p>
          </div>
        )}
      </Modal>

      {/* Modal Bayar */}
      <Modal
        title={`Bayar Gaji — ${bayarModal.data?.nama}`}
        open={bayarModal.visible}
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
