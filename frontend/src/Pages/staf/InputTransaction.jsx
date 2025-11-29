/* eslint-disable react-hooks/exhaustive-deps */
// pages/staff/InputTransaksiPage.jsx
import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Button,
  Select,
  Tag,
  DatePicker,
  Upload,
  message,
  Modal,
  Card,
  Row,
  Col,
  Space,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import moment from "moment";
import axios from "axios";
import { toast } from "react-toastify";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Lightbox from "yet-another-react-lightbox";
const { Option } = Select;
const { TextArea } = Input;

export default function InputTransaksiPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [lightbox, setLightbox] = useState({
    open: false,
    index: 0,
    images: [],
  });
  const [transaksi, setTransaksi] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    staf: "",
    divisi: "",
    jenis: "Pemasukan",
    nominal: "",
    tanggal: moment(),
    catatan: "",
    bukti: [],
  });
  const [detailModal, setDetailModal] = useState({
    visible: false,
    data: null,
  });

  // Ambil info staff yang login
  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(
        "http://localhost:5000/api/login/staff-info",
        {
          headers: {
            Authorization: `Bearer ${token}`, // WAJIB ADA SPASI
          },
        }
      );

      console.log(res);

      setCurrentUser(res.data.user);
      setForm((prev) => ({
        ...prev,
        staf: res.data.user.name,
        divisi: res.data.user.divisi?.name || "",
      }));
    } catch (err) {
      console.error(err);
    }
  };

  // Ambil transaksi staff ini saja
  const fetchTransaksi = async () => {
    if (!currentUser) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/transaksi/me", {
        headers: { Authorization: `Bearer ${token}` },
        params: { staffId: currentUser.id }, // FIX
      });
      const data = res.data.transaksi.map((t) => ({
        ...t,
        tanggal: moment(t.createdAt),
        divisi: t.staff.divisi?.name || "-",
        jenis: t.type === "pemasukan" ? "Pemasukan" : "Pengeluaran",
        nominal: t.amount,
        status: t.status.charAt(0).toUpperCase() + t.status.slice(1),
        staf: t.staff.name, // tambah agar bisa difilter
      }));

      setTransaksi(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) fetchTransaksi();
  }, [currentUser]);

  const startEdit = (record) => {
    if (record.status !== "Pending") {
      toast.warning("Transaksi sudah di-approve/reject, tidak bisa diedit.");
      return;
    }

    // Convert bukti lama menjadi format fileList upload
    const buktiLama =
      record.buktiTransaksi?.map((file, idx) => ({
        uid: `old-${idx}`,
        name: file,
        status: "done",
        url: `http://localhost:5000/imageBook/${file}`,
        old: true, // penanda bukti lama
      })) || [];

    setEditingId(record.id);
    setForm({
      staf: record.staf,
      divisi: record.divisi,
      jenis: record.jenis,
      nominal: record.nominal,
      tanggal: moment(record.tanggal),
      catatan: record.catatan || "",
      bukti: buktiLama, // penting!
    });
    setModalVisible(true);
  };

  const columns = [
    { title: "Divisi", dataIndex: "divisi", key: "divisi" },
    { title: "Jenis", dataIndex: "jenis", key: "jenis" },
    {
      title: "Nominal",
      dataIndex: "nominal",
      key: "nominal",
      render: (val) => `Rp ${val.toLocaleString()}`,
    },
    {
      title: "Tanggal",
      dataIndex: "tanggal",
      key: "tanggal",
      render: (date) => date.format("YYYY-MM-DD"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color =
          status === "Pending"
            ? "orange"
            : status === "Approved"
            ? "green"
            : "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Aksi",
      key: "aksi",
      render: (_, record) => (
        <Space>
          {record.status === "Pending" && (
            <Button onClick={() => startEdit(record)}>Edit</Button>
          )}
          <Button
            onClick={() => {
              console.log(record);

              setDetailModal({ visible: true, data: record });
            }}
          >
            Detail
          </Button>
        </Space>
      ),
    },
  ];

  const filteredTransaksi = transaksi.filter(
    (t) => currentUser && t.staf === currentUser.name
  );

  // Hitung summary
  const totalTransaksi = filteredTransaksi.length;
  const totalPemasukan = filteredTransaksi
    .filter((t) => t.jenis === "Pemasukan")
    .reduce((sum, t) => sum + t.nominal, 0);
  const totalPengeluaran = filteredTransaksi
    .filter((t) => t.jenis === "Pengeluaran")
    .reduce((sum, t) => sum + t.nominal, 0);

  // Tambah atau edit transaksi
  const saveTransaksi = async () => {
    if (!form.jenis || !form.nominal) {
      message.error("Jenis dan Nominal wajib diisi");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (editingId) {
        // Edit transaksi
        const buktiBaru = form.bukti.filter((f) => !f.old);
        const buktiLama = form.bukti.filter((f) => f.old).map((f) => f.name);

        const formData = new FormData();
        formData.append("type", form.jenis.toLowerCase());
        formData.append("amount", Number(form.nominal));
        formData.append("description", form.catatan);
        formData.append("oldBukti", JSON.stringify(buktiLama));

        buktiBaru.forEach((file) => {
          formData.append("bukti", file.originFileObj);
        });

        const res = await axios.put(
          `http://localhost:5000/api/transaksi/${editingId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(res);

        setTransaksi((prev) =>
          prev.map((t) =>
            t.id === editingId
              ? {
                  ...t,
                  jenis: form.jenis,
                  nominal: Number(form.nominal),
                  tanggal: form.tanggal,
                  catatan: form.catatan,
                }
              : t
          )
        );
        toast.success("Transaksi berhasil diperbarui");
      } else {
        const formData = new FormData();
        formData.append("type", form.jenis.toLowerCase());
        formData.append("amount", form.nominal);
        formData.append("description", form.catatan);
        formData.append("staffId", currentUser.id);

        // Lampiran bukti
        form.bukti.forEach((file) => {
          formData.append("bukti", file.originFileObj);
        });
        // Tambah transaksi baru
        const res = await axios.post(
          "http://localhost:5000/api/transaksi/create",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setTransaksi((prev) => [
          {
            ...res.data.transaksi,
            tanggal: moment(res.data.transaksi.createdAt),
            divisi: currentUser.divisi?.name || "",
            jenis: form.jenis,
            nominal: Number(form.nominal),
            status: "Pending",
            bukti: form.bukti,
          },
          ...prev,
        ]);
        toast.success("Transaksi berhasil ditambahkan");
      }
      fetchTransaksi();
      // Reset form
      setForm({
        staf: currentUser.name,
        divisi: currentUser.divisi?.name || "",
        jenis: "Pemasukan",
        nominal: "",
        tanggal: moment(),
        catatan: "",
        bukti: [],
      });
      setEditingId(null);
      setModalVisible(false);
    } catch (err) {
      console.error(err);
      toast.error("Gagal menyimpan transaksi");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-indigo-600 mb-6">
        Dashboard Bendahara
      </h1>
      {/* Summary Card */}
      <Row gutter={16} className="mb-6">
        <Col>
          <Card title="Total Transaksi" bordered>
            {totalTransaksi}
          </Card>
        </Col>
        <Col>
          <Card title="Total Pemasukan" bordered>
            Rp {totalPemasukan.toLocaleString()}
          </Card>
        </Col>
        <Col>
          <Card title="Total Pengeluaran" bordered>
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
        dataSource={filteredTransaksi}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
      {/* Modal Form */}
      <Modal
        title={editingId ? "Edit Transaksi" : "Tambah Transaksi"}
        visible={modalVisible}
        onOk={saveTransaksi}
        onCancel={() => setModalVisible(false)}
        okText="Simpan"
      >
        <Input
          value={form.divisi}
          readOnly
          style={{ width: "100%", marginBottom: 10, cursor: "not-allowed" }}
        />

        <Select
          value={form.jenis}
          onChange={(val) => setForm({ ...form, jenis: val })}
          style={{ width: "100%", marginBottom: 10 }}
        >
          <Option value="Pemasukan">Pemasukan</Option>
          <Option value="Pengeluaran">Pengeluaran</Option>
        </Select>

        <Input
          type="number"
          placeholder="Nominal"
          value={form.nominal}
          onChange={(e) => setForm({ ...form, nominal: e.target.value })}
          style={{ width: "100%", marginBottom: 10 }}
        />

        <DatePicker
          value={form.tanggal}
          onChange={(date) => setForm({ ...form, tanggal: date })}
          style={{ width: "100%", marginBottom: 10 }}
        />

        <TextArea
          placeholder="Catatan"
          value={form.catatan}
          onChange={(e) => setForm({ ...form, catatan: e.target.value })}
          rows={3}
          style={{ marginBottom: 10 }}
        />

        <Upload
          name="bukti"
          multiple
          listType="picture-card"
          beforeUpload={(file) => {
            const newFile = {
              uid: file.uid,
              name: file.name,
              status: "done",
              originFileObj: file,
              url: URL.createObjectURL(file),
            };

            // Pastikan tidak overwrite
            setForm((prev) => ({
              ...prev,
              bukti: [...prev.bukti, newFile],
            }));

            return false; // penting: biar tidak auto-upload oleh antd
          }}
          fileList={form.bukti}
          onRemove={(file) =>
            setForm((prev) => ({
              ...prev,
              bukti: prev.bukti.filter((f) => f.uid !== file.uid),
            }))
          }
          onPreview={(file) => {
            const src =
              file.url ||
              file.preview ||
              URL.createObjectURL(file.originFileObj);

            Modal.info({
              title: "Preview Bukti",
              content: <img src={src} style={{ width: "100%" }} />,
              width: 600,
              okText: "Tutup",
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
          <div
            style={{
              display: "grid",
              gap: 12,
              padding: 10,
              background: "#fafafa",
              borderRadius: 10,
            }}
          >
            {/* Card Info */}
            <div
              style={{
                padding: 15,
                background: "white",
                borderRadius: 10,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
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
                <b>Tanggal:</b> {detailModal.data.tanggal.format("YYYY-MM-DD")}
              </p>
              <p>
                <b>Status:</b> {detailModal.data.status}
              </p>
              <p>
                <b>Catatan:</b> {detailModal.data.description || "-"}
              </p>
            </div>

            {/* Bukti Transaksi */}
            <div
              style={{
                padding: 15,
                background: "white",
                borderRadius: 10,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <p>
                <b>Bukti Transaksi:</b>
              </p>

              {detailModal.data.buktiTransaksi?.length > 0 ? (
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {detailModal.data.buktiTransaksi.map((file, idx) => (
                    <img
                      key={idx}
                      src={`http://localhost:5000/imageBook/${file}`}
                      alt={`bukti-${idx}`}
                      style={{
                        width: 120,
                        height: 120,
                        objectFit: "cover",
                        borderRadius: 8,
                        cursor: "pointer",
                        border: "1px solid #ddd",
                      }}
                      onClick={() =>
                        setLightbox({
                          open: true,
                          index: idx,
                          images: detailModal.data.buktiTransaksi.map(
                            (img) => ({
                              src: `http://localhost:5000/imageBook/${img}`,
                            })
                          ),
                        })
                      }
                    />
                  ))}
                </div>
              ) : (
                <p style={{ color: "gray" }}>- Tidak ada bukti transaksi -</p>
              )}
            </div>

            {/* Lightbox */}
            {lightbox.open && (
              <Lightbox
                open={lightbox.open}
                close={() => setLightbox({ open: false })}
                index={lightbox.index}
                slides={lightbox.images}
                plugins={[Thumbnails]}
              />
            )}
          </div>
        )}
      </Modal>
      ;
    </div>
  );
}
