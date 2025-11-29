/* eslint-disable react-hooks/immutability */
import {
  Button,
  Table,
  Input,
  Badge,
  Form,
  Card,
  Select,
  DatePicker,
} from "antd";
import axios from "axios";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";

export default function GajiKaryawan({ karyawan, staffList }) {
  const [form] = Form.useForm();
  const [gajiList, setGajiList] = useState([]);
  console.log(karyawan);

  useEffect(() => {
    if (karyawan?.id) {
      fetchGaji();
    }
  }, [karyawan]);

  // Submit gaji → dikirim ke backend
  const submitGaji = async (values) => {
    try {
      // Validasi tanggal
      if (!values.tanggal) {
        toast.error("Tanggal/bulan gaji wajib diisi");
        return;
      }

      const total =
        Number(values.gajiPokok) +
        Number(values.dinasLuarKota || 0) -
        Number(values.potongan || 0);

      const payload = {
        karyawanId: karyawan.id,
        staffId: values.staffId,
        gajiPokok: Number(values.gajiPokok),
        DinasLuarKota: Number(values.dinasLuarKota || 0),
        potongan: Number(values.potongan || 0),
        totalGaji: total,
        month: values.tanggal.toISOString(), // ← FIX DI SINI
      };

      const res = await axios.post(
        "http://localhost:5000/api/gaji/create",
        payload
      );

      setGajiList((prev) => [...prev, res.data.data]);
      toast.success("Data gaji karyawan berhasil ditambahkan");
      form.resetFields();
    } catch (error) {
      console.error("Error submit gaji:", error);
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Terjadi kesalahan saat menyimpan data gaji";

      toast.error(msg);
    }
  };

  const fetchGaji = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/gaji/${karyawan.id}`
      );
      setGajiList(res.data.data || []);
    } catch (err) {
      console.log(err);
      toast.error("Gagal mengambil data gaji");
    }
  };

  /** TABLE */
  const columns = [
    {
      title: "Bulan",
      dataIndex: "month",
      render: (v) =>
        new Date(v).toLocaleDateString("id-ID", {
          month: "long",
          year: "numeric",
        }),
    },
    {
      title: "Total Gaji",
      dataIndex: "totalGaji",
      render: (v) => <b>Rp {v.toLocaleString()}</b>,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) =>
        status === "paid" ? (
          <Badge status="success" text="Sudah Dibayar" />
        ) : (
          <Badge status="error" text="Belum Dibayar" />
        ),
    },
    {
      title: "Dibayarkan Oleh",
      dataIndex: ["staff", "name"],
      render: (name) =>
        name ? <span className="font-semibold">{name}</span> : "-",
    },
    {
      title: "Bukti Pembayaran",
      dataIndex: "buktiPembayaran",
      render: (file) =>
        file ? (
          <a
            href={`http://localhost:5000/imageBook/${file}`}
            target="_blank"
            className="text-blue-600 underline"
          >
            Lihat Bukti
          </a>
        ) : (
          <i className="text-gray-500">Belum ada bukti</i>
        ),
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Pengaturan Gaji — {karyawan?.name} ({karyawan.divisi?.name})
      </h2>

      <Card className="mb-5 shadow">
        <Form form={form} layout="vertical" onFinish={submitGaji}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* PILIH STAFF */}
            <Form.Item
              label="Pilih Staff Pembayar"
              name="staffId"
              rules={[{ required: true, message: "Staff wajib dipilih" }]}
            >
              <Select placeholder="Pilih staff yang akan membayar">
                {staffList.map((s) => (
                  <Select.Option key={s.id} value={s.id}>
                    {s.name} — {s.division}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            {/* BULAN */}
            <Form.Item
              label="Tanggal Pembayaran"
              name="tanggal"
              rules={[
                { required: true, message: "Tanggal pembayaran wajib diisi" },
              ]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            {/* GAJI POKOK */}
            <Form.Item
              label="Gaji Pokok"
              name="gajiPokok"
              initialValue={karyawan.gaji}
              rules={[{ required: true, message: "Gaji pokok wajib diisi" }]}
            >
              <Input type="number" placeholder="Masukkan gaji pokok" />
            </Form.Item>

            {/* DINAS LUAR KOTA */}
            <Form.Item label="Dinas Luar Kota" name="dinasLuarKota">
              <Input type="number" placeholder="Opsional" />
            </Form.Item>

            {/* POTONGAN */}
            <Form.Item label="Potongan" name="potongan">
              <Input type="number" placeholder="Opsional" />
            </Form.Item>
          </div>

          <Button type="primary" htmlType="submit" block className="mt-2">
            Buat Transaksi Gaji
          </Button>
        </Form>
      </Card>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={gajiList}
        scroll={{ x: 600 }}
        className="mt-5"
        pagination={{
          pageSizeOptions: [5, 10, 20],
          showSizeChanger: true,
          defaultPageSize: 5,
        }}
      />
    </div>
  );
}
