// Pages/DataKaryawan.jsx
import { useState, useEffect } from "react";
import { Button, Table, Modal, Card, Input } from "antd";
import AddKaryawanForm from "../../Components/form/AddKaryawanForm.jsx";
import EditKaryawanForm from "../../Components/form/EditKaryawanForm.jsx";
import GajiKaryawan from "../../Components/form/GajiKaryawan.jsx";
import SummaryCard from "../../Components/cards/SummaryCard.jsx";
import ModalDelete from "../../Components/modal/ModalDelete.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { Pie } from "@ant-design/plots";
export default function DataKaryawan() {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openGaji, setOpenGaji] = useState(false);
  const [selectedKaryawan, setSelectedKaryawan] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [divisions, setDivisions] = useState();
  const [data, setData] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedDelete, setSelectedDelete] = useState(null);

  const fetchKaryawan = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/karyawan", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res.data.data);
      setData(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengambil data users");
    }
  };

  // ambil divisions
  const fetchDivisions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/division/select", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // console.log(res.data);
      setDivisions(res.data.data); // <-- perbaikan: simpan ke state divisions
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengambil data divisions");
    }
  };
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDivisions();
    fetchKaryawan();
  }, []);

  // Ambil staff
  useEffect(() => {
    axios.get("http://localhost:5000/api/users").then((res) => {
      console.log(res);
      setStaffList(res.data.data);
    });
  }, []);

  // ==============================
  // SUMMARY
  // ==============================
  const totalKaryawan = data.length;

  const totalGaji = data.reduce((sum, k) => {
    const latest = k.gaji?.[k.gaji.length - 1];
    return sum + (latest?.total || 0);
  }, 0);

  // ==============================
  // FIXED SUMMARY PER TRANSAKSI
  // ==============================
  const semuaTransaksi = data.flatMap((k) => k.gajiTransaksi || []);

  const sudahDibayar = semuaTransaksi.filter((t) => t.status === "paid").length;

  const belumDibayar = semuaTransaksi.filter(
    (t) => t.status === "pending"
  ).length;

  const pieData = [
    { type: "Sudah Dibayar", value: sudahDibayar },
    { type: "Belum Dibayar", value: belumDibayar },
  ];
  // ==============================
  // TABLE COLUMNS
  // ==============================
  const columns = [
    { title: "Nama", dataIndex: "name" },

    {
      title: "Divisi",
      render: (row) => row.divisi?.name || "-",
    },

    { title: "Posisi", dataIndex: "posisi" },
    { title: "Email", dataIndex: "email" },

    {
      title: "Gaji Pokok",
      dataIndex: "gaji",
      render: (v) => `Rp ${v.toLocaleString()}`,
    },

    {
      title: "Aksi",
      render: (record) => (
        <div className="flex gap-2">
          <Button
            type="primary"
            onClick={() => {
              setSelectedKaryawan(record);
              setOpenEdit(true);
            }}
          >
            Edit
          </Button>
          <Button
            danger
            onClick={() => {
              setSelectedDelete(record);
              setOpenDelete(true);
            }}
          >
            Hapus
          </Button>
          <Button onClick={() => openGajiModal(record)}>Lihat Gaji</Button>
        </div>
      ),
    },
  ];

  // Filtered Data

  const filteredData = data.filter((item) => {
    const search = searchText.toLowerCase();
    const name = item.name?.toLowerCase() || "";
    const email = item.email?.toLowerCase() || "";
    const divisi = item.divisi?.name?.toLowerCase() || "";
    const posisi = item.posisi?.toLowerCase() || "";

    return (
      name.includes(search) ||
      email.includes(search) ||
      divisi.includes(search) ||
      posisi.includes(search)
    );
  });

  // ==============================
  // HANDLE ADD KARYAWAN
  // ==============================

  const handleAddKaryawan = async (values) => {
    try {
      const token = localStorage.getItem("token");
      console.log(values);
      const res = await axios.post(
        "http://localhost:5000/api/karyawan",
        values,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(res);

      toast.success("Karyawan berhasil ditambahkan");

      // Refresh table
      fetchKaryawan();
      // Tutup modal
      setOpenAdd(false);
    } catch (err) {
      console.error(err);
      toast.error("Gagal menambahkan karyawan");
    }
  };

  const handleUpdate = async (updatedData) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/karyawan/${updatedData.id}`,
        {
          name: updatedData.name,
          email: updatedData.email,
          phone: updatedData.phone,
          posisi: updatedData.posisi,
          addres: updatedData.addres,
          divisiId: updatedData.divisiId,
          gaji: updatedData.gaji,
        }
      );

      // update local
      setData((prev) =>
        prev.map((d) => (d.id === updatedData.id ? res.data.data : d))
      );

      toast.success("Karyawan berhasil diupdate");
    } catch (error) {
      console.log(error);
      toast.error("Gagal update karyawan");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/karyawan/${selectedDelete.id}`
      );

      setData((prev) => prev.filter((d) => d.id !== selectedDelete.id));
      toast.success("Data berhasil dihapus");
    } catch (err) {
      console.log(err);

      toast.error("Gagal menghapus data");
    } finally {
      setOpenDelete(false);
    }
  };

  const openGajiModal = (record) => {
    console.log(record);

    setSelectedKaryawan(record);
    setOpenGaji(true);
  };

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
        <h3 className="font-semibold text-lg mb-3">
          Status Pembayaran Gaji Karyawan
        </h3>

        <Pie
          data={pieData}
          radius={0.9}
          angleField="value"
          colorField="type"
          label={{ type: "outer", content: "{value}" }}
          tooltip={{
            fields: ["type", "value"],
          }}
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

        <Button type="primary" onClick={() => setOpenAdd(true)}>
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

      {/* Modal Delete */}
      <ModalDelete
        open={openDelete}
        name={selectedDelete?.name}
        onCancel={() => setOpenDelete(false)}
        onConfirm={handleDelete}
      />

      {/* ==============================
          MODAL ADD
      ============================== */}
      <Modal open={openAdd} onCancel={() => setOpenAdd(false)} footer={null}>
        <AddKaryawanForm divisions={divisions} onSubmit={handleAddKaryawan} />
      </Modal>

      {/* ==============================
          MODAL EDIT
      ============================== */}
      <Modal open={openEdit} onCancel={() => setOpenEdit(false)} footer={null}>
        <EditKaryawanForm
          selected={selectedKaryawan}
          divisions={divisions}
          onSubmit={handleUpdate}
          setOpen={setOpenEdit}
          setData={setData}
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
        {selectedKaryawan ? (
          <GajiKaryawan karyawan={selectedKaryawan} staffList={staffList} />
        ) : (
          <p>Loading...</p>
        )}
      </Modal>
    </div>
  );
}
