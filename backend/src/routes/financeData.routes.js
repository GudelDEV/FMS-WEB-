import express from "express";
import prisma from "../config/db.js"; // prisma client

const router = express.Router();

router.get("/periode/:mode", async (req, res) => {
  try {
    const mode = req.params.mode || "monthly";

    let startDate;
    const today = new Date();

    if (mode === "monthly") {
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    } else if (mode === "weekly") {
      startDate = new Date();
      startDate.setDate(today.getDate() - 7);
    } else if (mode === "yearly") {
      startDate = new Date(today.getFullYear(), 0, 1);
    }

    const transaksi = await prisma.transaksi.findMany({
      where: {
        createdAt: { gte: startDate },
      },
      include: {
        staff: { include: { divisi: true } },
      },
    });

    const perDivisi = {};

    transaksi.forEach((tr) => {
      const divisi = tr.staff.divisi.name;

      if (!perDivisi[divisi]) {
        perDivisi[divisi] = {
          divisi,
          pemasukan: 0,
          pengeluaran: 0,
          details: [],
        };
      }

      if (tr.type === "pemasukan") perDivisi[divisi].pemasukan += tr.amount;
      if (tr.type === "pengeluaran") perDivisi[divisi].pengeluaran += tr.amount;

      perDivisi[divisi].details.push(tr);
    });

    res.json({
      success: true,
      periode: mode,
      data: Object.values(perDivisi),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Gagal mengambil data finance" });
  }
});

export default router;
