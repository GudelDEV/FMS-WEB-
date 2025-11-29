import express from "express";
import prisma from "../config/db.js";

const router = express.Router();

router.get("/finance", async (req, res) => {
  try {
    const { periode = "monthly" } = req.query; // monthly, weekly, yearly
    const today = new Date();
    let startDate;

    if (periode === "monthly") {
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    } else if (periode === "weekly") {
      startDate = new Date();
      startDate.setDate(today.getDate() - 7);
    } else if (periode === "yearly") {
      startDate = new Date(today.getFullYear(), 0, 1);
    }

    // Ambil transaksi
    const transaksi = await prisma.transaksi.findMany({
      where: { createdAt: { gte: startDate } },
      include: { staff: { include: { divisi: true } } },
    });

    // Ambil gaji
    const gaji = await prisma.gajiTransaksi.findMany({
      where: { month: { gte: startDate } },
      include: { karyawan: true, staff: true },
    });

    // Summary
    const totalPemasukan = transaksi
      .filter((t) => t.type === "pemasukan")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalPengeluaran = transaksi
      .filter((t) => t.type === "pengeluaran")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalGaji = gaji.reduce((sum, g) => sum + g.totalGaji, 0);

    const saldo = totalPemasukan - totalPengeluaran - totalGaji;

    // Group per divisi
    const perDivisi = {};
    transaksi.forEach((t) => {
      const div = t.staff.divisi?.name || "Tidak Ada Divisi";
      if (!perDivisi[div])
        perDivisi[div] = { divisi: div, pemasukan: 0, pengeluaran: 0 };
      if (t.type === "pemasukan") perDivisi[div].pemasukan += t.amount;
      else if (t.type === "pengeluaran") perDivisi[div].pengeluaran += t.amount;
    });

    res.json({
      totalPemasukan,
      totalPengeluaran,
      totalGaji,
      saldo,
      perDivisi: Object.values(perDivisi),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Gagal mengambil data dashboard" });
  }
});

export default router;
