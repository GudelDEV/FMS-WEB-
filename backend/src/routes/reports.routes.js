import express from "express";
import prisma from "../config/db.js";

const router = express.Router();

// GET all reports
router.get("/", async (req, res) => {
  try {
    const transaksi = await prisma.transaksi.findMany({
      include: { staff: { include: { divisi: true } } },
      orderBy: { createdAt: "desc" },
    });

    const gaji = await prisma.gajiTransaksi.findMany({
      include: { staff: { include: { divisi: true } }, karyawan: true },
      orderBy: { createdAt: "desc" },
    });

    const transaksiMapped = transaksi.map((t) => ({
      id: `T-${t.id}`,
      staf: t.staff.name,
      divisi: t.staff?.divisi?.name || "-",
      jenis: t.type === "pemasukan" ? "Pemasukan" : "Pengeluaran",
      nominal: t.amount,
      tanggal: t.createdAt,
      status: t.status,
      catatan: t.description || "-",
      bukti: t.buktiTransaksi || null, // <--- tambahkan ini
    }));

    const gajiMapped = gaji.map((g) => ({
      id: `G-${g.id}`,
      staf: g.staff.name,
      divisi: g.staff?.divisi?.name || "-",
      jenis: "Gaji",
      nominal: g.totalGaji,
      tanggal: g.month,
      status: g.status,
      catatan: `Gaji untuk ${g.karyawan.name}`,
      bukti: g.buktiPembayaran || null, // <--- tambahkan ini
    }));

    res.json([...transaksiMapped, ...gajiMapped]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// PUT Approve
// Approve transaksi
router.put("/approve/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await prisma.transaksi.update({
      where: { id: Number(id) },
      data: { status: "approved", approvedAt: new Date() },
    });
    res.json({ success: true, transaksi: updated });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Gagal approve transaksi" });
  }
});

// PUT Reject
// Reject transaksi
router.put("/reject/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await prisma.transaksi.update({
      where: { id: Number(id) },
      data: { status: "rejected" },
    });
    res.json({ success: true, transaksi: updated });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Gagal reject transaksi" });
  }
});

export default router;
